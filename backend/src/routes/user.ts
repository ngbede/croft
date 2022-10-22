import { Router } from 'express'
import {
  getUserViaId,
  createUser,
  resetPassword,
  signIn,
  updateUserDetail,
} from '../controllers/user-controller'
import authenticator from '../middleware/auth/authenticator'
const userRoute = Router()

userRoute.get('/user/:id', authenticator(), getUserViaId)
userRoute.post('/user/signup', createUser)
userRoute.post('/user/reset-password', resetPassword)
userRoute.post('/user/signin', signIn)
userRoute.patch('/user/:id', authenticator(), updateUserDetail)
// userRoute.delete('/user/:id', deleteUser)

export default userRoute
