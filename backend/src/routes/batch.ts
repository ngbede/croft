import { Router } from "express"
import { createBatch, deleteBatch, getBatch, updateBatch } from "../controllers/batch-controller"

const batchRouter = Router()

batchRouter.get("/batch/:id", getBatch) // get all batches for a given farm id
batchRouter.post("/batch/create", createBatch)
batchRouter.patch("/batch/:id", updateBatch)
batchRouter.delete("/batch/:id", deleteBatch)

export default batchRouter
