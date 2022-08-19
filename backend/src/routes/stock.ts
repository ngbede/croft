import { Router } from "express"
import { createStock, deleteStock, getStock, updateStock } from "../controllers/stock-controller"

const stockRouter = Router()

stockRouter.get("/stock/:id", getStock) // get stock by its id
stockRouter.post("/stock/create", createStock)
stockRouter.patch("/stock/:id", updateStock)
stockRouter.delete("/stock/:id", deleteStock)

export default stockRouter
