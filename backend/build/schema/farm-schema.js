"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.farmSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.farmSchema = joi_1.default.object({
    owner_id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone_number_1: joi_1.default.string().min(11).max(18).required(),
    state: joi_1.default.string().required(),
    lga: joi_1.default.string().required(),
    phone_number_2: joi_1.default.string().min(11).max(18),
    coordinate: joi_1.default.object(),
    land_measurement: joi_1.default.object(),
});
