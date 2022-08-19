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
exports.updateBatch = exports.deleteBatch = exports.getBatch = exports.createBatch = void 0;
const init_1 = require("../db/init");
const validator_1 = __importDefault(require("validator"));
const batch_schema_1 = require("../schema/batch-schema");
const parse_validation_errors_1 = __importDefault(require("../utils/parse-validation-errors"));
const pg_1 = require("../db/pg");
const batch_queries_1 = require("../queries/batch-queries");
// refactor UUID validation logic
const createBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBatch = req.body;
    const { error: validationError, value } = batch_schema_1.batchSchema.validate(newBatch, { abortEarly: false });
    const errors = (0, parse_validation_errors_1.default)(validationError);
    if (errors.length > 0) {
        return res.status(422).json({
            message: "validation failed on request body",
            errors: errors
        });
    }
    const { data, error } = yield init_1.supabase.from("batch").insert([newBatch]);
    if (error) {
        return res.status(400).json({ message: "Error creating new batch", error: error });
    }
    if (data.length > 0) {
        return res.status(200).json({ message: "New batch created", data: data[0] });
    }
});
exports.createBatch = createBatch;
const getBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const farmId = req.params.id;
    const isValidUUID = validator_1.default.isUUID(farmId);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    try {
        const response = yield pg_1.pgInstance.query((0, batch_queries_1.getBatchQuery)(), [farmId]);
        console.log(response);
        if (response.rowCount > 0) {
            return res.status(200).json(response.rows);
        }
        else {
            return res.status(404).json({ message: "No batches found for given farm id" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error: unable to fetch data", error: error });
    }
});
exports.getBatch = getBatch;
const deleteBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const batchId = req.params.id;
    const isValidUUID = validator_1.default.isUUID(batchId);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    const { data, error } = yield init_1.supabase.from("batch").delete().match({ id: batchId });
    if (error) {
        return res.status(400).json(error);
    }
    if (data.length > 0) {
        return res.status(200).json({ message: `Batch successfully deleted`, data: data[0] });
    }
    else {
        return res.status(200).json({ message: `No batch with id ${batchId} found` });
    }
});
exports.deleteBatch = deleteBatch;
const updateBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const batchId = req.params.id;
    const newBatch = req.body;
    const isValidUUID = validator_1.default.isUUID(batchId);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    /**
     * Update
     * "name"
     * "active"
     */
    const { data: oldBatch, error } = yield init_1.supabase.from("batch").select(`name,
        active`).match({ id: batchId });
    if (error) {
        return res.status(500).json({ message: "Unable to fetch: internal server error", error: error });
    }
    if (oldBatch.length > 0) {
        const batchCopy = oldBatch[0];
        const { data, error } = yield init_1.supabase.from("batch").update({
            name: (_a = newBatch.name) !== null && _a !== void 0 ? _a : batchCopy.name,
            active: (_b = newBatch.active) !== null && _b !== void 0 ? _b : batchCopy.active,
            bird_category: (_c = newBatch.bird_category) !== null && _c !== void 0 ? _c : batchCopy.bird_category
        }).match({ id: batchId });
        if (error) {
            return res.status(400).json(error);
        }
        else {
            return res.status(200).json(data);
        }
    }
    else {
        return res.status(400).json({ message: `Batch with id ${batchId} doesn't exist` });
    }
});
exports.updateBatch = updateBatch;
