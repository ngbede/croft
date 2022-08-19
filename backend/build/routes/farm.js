"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farm_controller_1 = require("../controllers/farm-controller");
const farmRouter = (0, express_1.Router)();
farmRouter.post("/farm/register", farm_controller_1.registerFarm);
farmRouter.patch("/farm/:id", farm_controller_1.updateFarm);
farmRouter.delete("/farm/:id", farm_controller_1.deleteFarm);
exports.default = farmRouter;
