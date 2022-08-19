"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.batchSchema = joi_1.default.object({
    created_by: joi_1.default.string().required(),
    farm_id: joi_1.default.string().required(),
    name: joi_1.default.string().max(50).required(),
    active: joi_1.default.boolean(),
    bird_category: joi_1.default.string().max(10).required(),
    initial_population: joi_1.default.number().required(),
    total_cost: joi_1.default.number().required(),
});
