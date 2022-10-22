import { NextFunction, Request, Response } from 'express'
import { orderSchema } from '../schema/order-schema'
import OrderController from '../modules/order/controller'

const orderControl: OrderController = new OrderController('orders', 'order')

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  return await orderControl.post(req, res, next, orderSchema)
}

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  return await orderControl.get(req, res, next)
}

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  return await orderControl.patch(req, res, next)
}
