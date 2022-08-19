"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.stockSchema = joi_1.default.object({
    farm_id: joi_1.default.string().required(),
    batch_id: joi_1.default.string().required(),
    created_by: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    chicken_count: joi_1.default.array().required(),
    egg_count: joi_1.default.array().required(),
    comment: joi_1.default.array().required()
});
