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
exports.updateFarm = exports.deleteFarm = exports.registerFarm = void 0;
const init_1 = require("../db/init");
const parse_validation_errors_1 = __importDefault(require("../utils/parse-validation-errors"));
const validator_1 = __importDefault(require("validator"));
const farm_schema_1 = require("../schema/farm-schema");
const registerFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: validationError, value } = farm_schema_1.farmSchema.validate(req.body, { abortEarly: false });
    const errors = (0, parse_validation_errors_1.default)(validationError);
    if (errors.length > 0) {
        return res.status(422).json({
            message: "validation failed on request body",
            errors: errors
        });
    }
    const newFarm = value;
    const { data, error } = yield init_1.supabase.from("farms").insert([newFarm]);
    if (error) {
        error.message = error.message.replace('\"', "'").replace('\"', "'");
        return res.status(404).json(error);
    }
    if (data.length > 0)
        return res.status(200).json(data[0]);
});
exports.registerFarm = registerFarm;
const deleteFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidUUID = validator_1.default.isUUID(id);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    const { data, error } = yield init_1.supabase.from("farms").delete().match({ id: id });
    if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    if (data.length > 0) {
        return res.status(200).json({ message: `Farm with id ${id} deleted`, data: data });
    }
    else {
        return res.status(400).json({ message: `No farm with specified id ${id} exist` });
    }
});
exports.deleteFarm = deleteFarm;
const updateFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const id = req.params.id;
    const newData = req.body;
    const isValidUUID = validator_1.default.isUUID(id);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    /**
     * update
     * - coordinate
     * - land_measurement
     * - phone_number_1
     * - address
     * - phone_number_2
     * - state
     * - lga
     */
    const { data: oldData, error: selectErr } = yield init_1.supabase.from("farms").select(`address, 
        coordinate, 
        land_measurement, 
        phone_number_1, 
        phone_number_2, 
        state, 
        lga`).match({ id: id });
    if (selectErr) {
        return res.status(500).json({ message: "Unable to fetch: internal server error", error: selectErr });
    }
    if (oldData.length > 0) {
        const farmCopy = oldData[0];
        const latlng = {
            lat: newData.coordinate.lat,
            long: newData.coordinate.long
        };
        const { data, error } = yield init_1.supabase.from("farms").update({
            address: (_a = newData.address) !== null && _a !== void 0 ? _a : farmCopy.address,
            coordinate: latlng !== null && latlng !== void 0 ? latlng : farmCopy.coordinate,
            land_measurement: (_b = newData.land_measurement) !== null && _b !== void 0 ? _b : farmCopy.land_measurement,
            phone_number_1: (_c = newData.phone_number_1) !== null && _c !== void 0 ? _c : farmCopy.phone_number_1,
            phone_number_2: (_d = newData.phone_number_2) !== null && _d !== void 0 ? _d : farmCopy.phone_number_2,
            state: (_e = newData.state) !== null && _e !== void 0 ? _e : farmCopy.state,
            lga: (_f = newData.lga) !== null && _f !== void 0 ? _f : farmCopy.lga,
            updated_at: new Date
        }).match({ id: id });
        if (error) {
            return res.status(400).json(error);
        }
        else {
            return res.status(200).json(data);
        }
    }
    else {
        return res.status(400).json({ message: `Farm with id ${id} doesn't exist` });
    }
});
exports.updateFarm = updateFarm;
