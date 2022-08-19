import { Router } from "express"
import { deleteFarm, registerFarm, updateFarm } from "../controllers/farm-controller"

const farmRouter = Router()

farmRouter.post("/farm/register", registerFarm)
farmRouter.patch("/farm/:id", updateFarm)
farmRouter.delete("/farm/:id", deleteFarm)

export default farmRouter
