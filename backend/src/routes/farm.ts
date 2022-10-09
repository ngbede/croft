import { Router } from 'express'
import authenticator from '../middleware/auth/authenticator'
import {
  deleteFarm,
  getFarm,
  getFarmList,
  registerFarm,
  updateFarm,
} from '../controllers/farm-controller'

const farmRouter = Router()

farmRouter.get('/farm', authenticator, getFarmList)
farmRouter.get('/farm/:id', authenticator, getFarm)
farmRouter.post('/farm/register', registerFarm)
farmRouter.patch('/farm/:id', authenticator, updateFarm)
farmRouter.delete('/farm/:id', authenticator, deleteFarm)

export default farmRouter
