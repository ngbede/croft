import { NextFunction, Request, Response } from 'express'
import { getFarmDetailQuery } from '../queries/farm-query'
import { farmSchema } from '../schema/farm-schema'
import BaseController from './base/base-controller'

const baseControl = new BaseController('farms', 'farm')

export const getFarm = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.get(req, res, next, getFarmDetailQuery())
}

export const getFarmList = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.get(req, res, next, getFarmDetailQuery(true))
}

export const registerFarm = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.post(req, res, next, farmSchema)
}

export const deleteFarm = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.delete(req, res, next)
}

export const updateFarm = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.patch(req, res, next)
}
