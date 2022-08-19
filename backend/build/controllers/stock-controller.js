"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStock = exports.getStock = exports.deleteStock = exports.createStock = void 0;
const init_1 = require("../db/init");
const validator_1 = __importDefault(require("validator"));
const parse_validation_errors_1 = __importDefault(require("../utils/parse-validation-errors"));
const pg_1 = require("../db/pg");
const stock_schema_1 = require("../schema/stock-schema");
const stock_queries_1 = require("../queries/stock-queries");
const enums_1 = require("../schema/enums");
const console_1 = __importDefault(require("console"));
const createStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add a check to prevent duplicate stock-count per day i.e one stock count doc per day per farm for diff stock types
    const { error: validationError, value } = stock_schema_1.stockSchema.validate(req.body, { abortEarly: false });
    const errors = (0, parse_validation_errors_1.default)(validationError);
    if (errors.length > 0) {
        return res.status(422).json({
            message: "validation failed on request body",
            errors: errors
        });
    }
    const newStock = value;
    const { data: fetchStock, error: fetchError } = yield init_1.supabase.from("stock_report").select(`*`).match({ farm_id: newStock.farm_id });
    if (fetchError) {
        console_1.default.error(fetchError);
        return res.status(500).json({ message: "Internal server error: unable to fetch data", error: fetchError });
    }
    if (fetchStock.length > 0) {
        let duplicateId = '';
        const dates = fetchStock.map((e) => {
            duplicateId = e.id;
            return new Date(e.created_at).toDateString();
        });
        const currentDate = new Date;
        const parseDate = currentDate.toDateString();
        // check if there is a stock record for the current day
        const dateExists = dates.includes(parseDate);
        if (dateExists) {
            return res.status(400).json({
                message: "Duplicate stock count records for same day not allowed",
                duplicateId: `${duplicateId}`
            });
        }
        const { data, error } = yield init_1.supabase.from("stock_report").insert([newStock]);
        if (error) {
            error.message = error.message.replace('\"', "'").replace('\"', "'");
            return res.status(404).json(error);
        }
        if (data.length > 0)
            return res.status(200).json(data[0]);
    }
    else { // no stock record for same day, then proceed with insert
        const { data, error } = yield init_1.supabase.from("stock_report").insert([newStock]);
        if (error) {
            error.message = error.message.replace('\"', "'").replace('\"', "'");
            return res.status(404).json(error);
        }
        if (data.length > 0)
            return res.status(200).json(data[0]);
    }
});
exports.createStock = createStock;
const deleteStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidUUID = validator_1.default.isUUID(id);
    if (!isValidUUID) {
        return res.status(422).json({ message: "Invalid uuid sent" });
    }
    const { data, error } = yield init_1.supabase.from("stock_report").delete().match({ id: id });
    if (error) {
        console_1.default.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    if (data.length > 0) {
        return res.status(200).json({ message: `Stock with id ${id} deleted`, data: data });
    }
    else {
        return res.status(400).json({ message: `No stock with specified id ${id} exist` });
    }
});
exports.deleteStock = deleteStock;
const getStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidUUID = validator_1.default.isUUID(id);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    let stockInfo;
    try {
        const response = yield pg_1.pgInstance.query((0, stock_queries_1.getStockInfo)(), [id]);
        if (response.rowCount > 0) {
            stockInfo = response.rows[0];
        }
        else {
            console_1.default.error(`No stock info found for given id ${id}`);
        }
    }
    catch (error) {
        console_1.default.error(`Unable to connect to PG client.\nErr: ${error}`);
    }
    const { data, error } = yield init_1.supabase.from("stock_report").select("*").match({ id: id });
    if (error) {
        console_1.default.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    if (data.length > 0) {
        if (stockInfo) {
            // remove id's we've fetched info for
            delete data[0].farm_id;
            delete data[0].batch_id;
            delete data[0].created_by;
            data[0].farm_name = stockInfo.farm_name;
            data[0].batch_name = stockInfo.batch_name;
            data[0].created_by = stockInfo.created_by;
        }
        return res.status(200).json(data[0]);
    }
    else {
        return res.status(400).json({ message: `No stock with specified id ${id} exist` });
    }
});
exports.getStock = getStock;
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidUUID = validator_1.default.isUUID(id);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    /**
     * OPERATION TYPES:
     * - add new object to stock field
     * - remove object from stock field
     *
     * USE CASES
     * - egg stock count removal and addition pathces just works.
     * - chicken count: next
     */
    // get stock type
    let stockData = req.body.type === enums_1.StockTypes.eggCount ? "egg_count" : "chicken_count";
    const { data, error } = yield init_1.supabase.from("stock_report").select(stockData).match({ id: id });
    if (error) {
        console_1.default.error(error);
        return res.status(500).json({ message: "Internal server error", error: error });
    }
    // TODO: model data properly
    if (data.length > 0 && Object.keys(data[0]).includes(stockData)) {
        if (req.body.operation === enums_1.StockOperations.add) {
            const copyData = data[0][stockData];
            console_1.default.log(copyData);
            req.body.data.forEach((e) => {
                copyData.push(e);
            });
            if (stockData === "egg_count") {
                const { data: updateData, error: updateError } = yield init_1.supabase.from("stock_report").update({
                    egg_count: copyData
                }).match({ id: id });
                console_1.default.log(updateError);
                return res.status(200).json(updateData);
            }
        }
        // return res.status(200).json(copyData)
    }
    return res.status(200).json(isValidUUID);
});
exports.updateStock = updateStock;
