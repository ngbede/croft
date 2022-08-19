"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../controllers/stock-controller");
const stockRouter = (0, express_1.Router)();
stockRouter.get("/stock/:id", stock_controller_1.getStock); // get stock by its id
stockRouter.post("/stock/create", stock_controller_1.createStock);
stockRouter.patch("/stock/:id", stock_controller_1.updateStock);
stockRouter.delete("/stock/:id", stock_controller_1.deleteStock);
exports.default = stockRouter;
