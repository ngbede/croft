import { NextFunction, Request, Response } from 'express'
import { farmSchema } from '../schema/farm-schema'
import BaseController from './base-controller'

const baseControl: BaseController = new BaseController('farms', 'farm')

export const getFarm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.get(req, res, next)
}

export const registerFarm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.post(req, res, next, farmSchema)
}

export const deleteFarm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.delete(req, res, next)
}

export const updateFarm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.patch(req, res, next)
}
