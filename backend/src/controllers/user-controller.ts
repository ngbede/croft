import { userSchema } from '../schema/user-schema'
import { Request, Response, NextFunction } from 'express'
import UserController from '../modules/user/controller'
import BaseController from './base/base-controller'

const userControl = new UserController('user')

// info is stored in separate table so probably makes sense to use a baseControl instance to handle this
const baseControl: BaseController = new BaseController('user_detail', 'user')

export const getUserViaId = (req: Request, res: Response, next: NextFunction) => {
  return userControl.get(req, res, next)
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  return userControl.create(req, res, next, userSchema)
}

export const resetPassword = (req: Request, res: Response, next: NextFunction) => {
  return userControl.passwordReset(req, res, next)
}

export const signIn = (req: Request, res: Response, next: NextFunction) => {
  return userControl.login(req, res, next)
}

export const updateUserDetail = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.patch(req, res, next)
}

export const deleteUser = (req: Request, res: Response) => {
  return userControl.closeAccount()
}
