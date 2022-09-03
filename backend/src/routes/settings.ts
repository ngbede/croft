import { Router } from 'express'
import {
  getSetting,
  updateSetting,
  uploadSetting,
} from '../controllers/setting-controller'
import authenticator from '../middleware/auth/authenticator'

const settingsRouter = Router()

settingsRouter.get('/setting', getSetting)
settingsRouter.get('/setting/:id', getSetting)
settingsRouter.post('/setting/create', uploadSetting)
settingsRouter.patch('/setting/:id', updateSetting)

export default settingsRouter
