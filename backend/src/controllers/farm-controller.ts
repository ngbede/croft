import { NextFunction, Request, Response } from 'express'
import { getFarmDetailQuery } from '../queries/farm-query'
import { farmSchema } from '../schema/farm-schema'
import BaseController from './base/base-controller'

const baseControl: BaseController = new BaseController('farms', 'farm')

export const getFarm = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.get(req, res, next, getFarmDetailQuery())
}

export const getFarmList = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.get(req, res, next, getFarmDetailQuery(true))
}

export const registerFarm = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.post(req, res, next, farmSchema)
}

export const deleteFarm = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.delete(req, res, next)
}

export const updateFarm = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.patch(req, res, next)
}
