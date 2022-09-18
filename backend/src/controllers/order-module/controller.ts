import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { trackingIdGen } from '../../api/write/tracking-gen'
import BaseController from '../base-controller'
import ErrorObject, { codeMapper } from '../../schema/error'
import { order } from '../../schema/order-schema'

export default class OrderController extends BaseController {
  constructor(tableName: string, nameSpace?: string) {
    super(tableName, nameSpace)
  }

  async post(
    req: Request,
    res: Response,
    next: NextFunction,
    schema: ObjectSchema
  ) {
    const newOrder: order = req.body
    const valid: boolean = this._validateBody(newOrder, next, schema)

    if (valid) {
      const { data, error } = await this.api.from<order>('orders').insert([
        {
          ...newOrder,
          order_id: trackingIdGen(),
          status: 'request', // default status for newly created order is request
        },
      ])
      if (error) {
        const e: ErrorObject = {
          message: error.message,
          code: codeMapper.get(error.code) || 404,
        }
        return next(e)
      }
      return res.status(200).json(data)
    }
  }
}
