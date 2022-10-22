import { userSchema } from '../schema/user-schema'
import { Request, Response, NextFunction } from 'express'
import UserController from '../modules/user/controller'
import BaseController from './base/base-controller'

const userControl: UserController = new UserController('user')

// info is stored in separate table so probably makes sense to use a baseControl instance to handle this
const baseControl: BaseController = new BaseController('user_detail', 'user')

export const getUserViaId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.get(req, res, next)
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.create(req, res, next, userSchema)
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.passwordReset(req, res, next)
}

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.login(req, res, next)
}

export const updateUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.patch(req, res, next)
}

export const deleteUser = async (req: Request, res: Response) => {
  return await userControl.closeAccount()
}
