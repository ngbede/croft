import { initPayment, updatePaymentStatus } from '../../services/payment'
import BaseController from '../../controllers/base/base-controller'
import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

export default class FinanceController extends BaseController {
  constructor(tableName: string, nameSpace?: string) {
    super(tableName, nameSpace)
  }

  async post(req: Request, res: Response, next: NextFunction, schema: ObjectSchema) {
    const { body } = req
    const valid: boolean = this._validateBody(body, next, schema)

    if (valid) {
      const data = await initPayment(body.order_id)
      return res.status(data.status).json(data)
    }
  }
}
