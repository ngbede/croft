import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { trackingIdGen } from '../../api/write/tracking-gen'
import BaseController from '../../controllers/base/base-controller'
import ErrorObject, { codeMapper } from '../../schema/error'
import { order } from '../../schema/order-schema'
import { rejectOrder } from './api/reject-order'
import { OrderStatus } from '../../schema/enums'

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
      const { data, error } = await this.supabase.from<order>('orders').insert([
        {
          ...newOrder,
          order_id: trackingIdGen(),
          is_complete: false,
          status: OrderStatus.request, // default status for newly created order is request
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

  async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id
    let body = req.body as order

    // exit request when any of data validation pipes fail
    if (!this._parseUUID(id, next)) return
    if (!this._rejectPatchColumns(body, next)) return

    if (body.status === OrderStatus.rejected) {
      body = rejectOrder(body, req.user?.id || 'null')
    } else if (body.status === OrderStatus.accepted) {

    }
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ ...body, updated_at: new Date().toJSON() })
      .match({ id: id })

    if (error) {
      // Postgrest doesn't return any error object for some reason
      console.error(error)
      const err: ErrorObject = {
        message: error.message,
        code: 400,
        error: error.details,
      }
      return next(err)
    } else {
      return res.status(200).json(data)
    }
  }
}
