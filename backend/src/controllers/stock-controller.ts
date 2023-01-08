import { NextFunction, Request, Response } from 'express'
import { stockSchema } from '../schema/stock-schema'
import { getStockInfo } from '../queries/stock-queries'
import StockController from '../modules/stock/controller'

const stockControl = new StockController('stock_report', 'stock count')

export const createStock = (req: Request, res: Response, next: NextFunction) => {
  return stockControl.post(req, res, next, stockSchema)
}

export const deleteStock = (req: Request, res: Response, next: NextFunction) => {
  return stockControl.delete(req, res, next)
}

export const getStock = (req: Request, res: Response, next: NextFunction) => {
  return stockControl.get(req, res, next, getStockInfo())
}

export const updateStock = (req: Request, res: Response, next: NextFunction) => {
  return stockControl.patch(req, res, next)
}
