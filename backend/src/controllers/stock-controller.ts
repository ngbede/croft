import { NextFunction, Request, Response } from 'express'
import { stockSchema } from '../schema/stock-schema'
import { getStockInfo } from '../queries/stock-queries'
import StockController from './stock-module/controller'

const stockControl: StockController = new StockController(
  'stock_report',
  'stock count'
)

export const createStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await stockControl.post(req, res, next, stockSchema)
}

export const deleteStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await stockControl.delete(req, res, next)
}

export const getStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await stockControl.get(req, res, next, getStockInfo())
}

export const updateStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await stockControl.patch(req, res, next)
}
