import { NextFunction, Request, Response } from 'express'
import FinanceController from '../modules/finance/controller'
import { financeSchema } from '../schema/finance-schema'

const financeControl = new FinanceController('payment_debit', 'finance')

export const initFinancePayment = (req: Request, res: Response, next: NextFunction) => {
  return financeControl.post(req, res, next, financeSchema)
}