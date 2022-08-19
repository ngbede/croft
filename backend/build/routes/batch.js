"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const batch_controller_1 = require("../controllers/batch-controller");
const batchRouter = (0, express_1.Router)();
batchRouter.get("/batch/:id", batch_controller_1.getBatch); // get all batches for a given farm id
batchRouter.post("/batch/create", batch_controller_1.createBatch);
batchRouter.patch("/batch/:id", batch_controller_1.updateBatch);
batchRouter.delete("/batch/:id", batch_controller_1.deleteBatch);
exports.default = batchRouter;
