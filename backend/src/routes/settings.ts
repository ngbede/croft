import { Router } from 'express'
import {
  getSetting,
  updateSetting,
  uploadSetting,
} from '../controllers/setting-controller'
import authenticator from '../middleware/auth/authenticator'

const settingsRouter = Router()

settingsRouter.get('/setting', authenticator, getSetting)
settingsRouter.get('/setting/:id', authenticator, getSetting)
settingsRouter.post('/setting/create', authenticator, uploadSetting)
settingsRouter.patch('/setting/:id', authenticator, updateSetting)

export default settingsRouter
