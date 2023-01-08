import { NextFunction, Request, Response } from 'express'
import { orderSchema } from '../schema/order-schema'
import OrderController from '../modules/order/controller'

const orderControl = new OrderController('orders', 'order')

export const createOrder = (req: Request, res: Response, next: NextFunction) => {
  return orderControl.post(req, res, next, orderSchema)
}

export const getOrder = (req: Request, res: Response, next: NextFunction) => {
  return orderControl.get(req, res, next)
}

export const updateOrder = (req: Request, res: Response, next: NextFunction) => {
  return orderControl.patch(req, res, next)
}

export const createOrderSnapshot = (req: Request, res: Response, next: NextFunction) => {
  return orderControl.put(req, res, next, orderSchema)
}
