import { Router } from "express"
import { deleteFarm, getFarm, registerFarm, updateFarm } from "../controllers/farm-controller"

const farmRouter = Router()

farmRouter.get("/farm/:id", getFarm)
farmRouter.post("/farm/register", registerFarm)
farmRouter.patch("/farm/:id", updateFarm)
farmRouter.delete("/farm/:id", deleteFarm)

export default farmRouter
