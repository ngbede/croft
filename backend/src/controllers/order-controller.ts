import { NextFunction, Request, Response } from 'express'
import { orderSchema } from '../schema/order-schema'
import BaseController from './base-controller'

const baseControl: BaseController = new BaseController('orders', 'order')

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.post(req, res, next, orderSchema)
}

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.get(req, res, next)
}

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.patch(req, res, next)
}
