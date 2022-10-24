import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { trackingIdGen } from '../../api/write/tracking-gen'
import BaseController from '../../controllers/base/base-controller'
import ErrorObject, { codeMapper } from '../../schema/error'
import { order } from '../../schema/order-schema'
import { packOrder, receiveOrder, acceptOrder, rejectOrder, transitOrder, } from './api/index'
import { OrderStatus } from '../../schema/enums'

export default class OrderController extends BaseController {
  constructor(tableName: string, nameSpace?: string) {
    super(tableName, nameSpace)
  }

  private _snapshotCreate(newOrderSnap: order, oldOrderSnap: order, user: string) {
    if (newOrderSnap.status === OrderStatus.rejected && oldOrderSnap.status === OrderStatus.request) {
      newOrderSnap = rejectOrder(newOrderSnap, user) // req.user?.id || 'null'
    } else if (newOrderSnap.status === OrderStatus.accepted && oldOrderSnap.status === OrderStatus.request) {
      newOrderSnap = acceptOrder(newOrderSnap, user)
    } else if (newOrderSnap.status === OrderStatus.packed && oldOrderSnap.status === OrderStatus.accepted) {
      newOrderSnap = packOrder(newOrderSnap, oldOrderSnap, user)
    } else if (newOrderSnap.status === OrderStatus.transit && oldOrderSnap.status === OrderStatus.packed) {
      newOrderSnap = transitOrder(newOrderSnap, oldOrderSnap, user)
    } else if (newOrderSnap.status === OrderStatus.received && oldOrderSnap.status === OrderStatus.transit) {
      newOrderSnap = receiveOrder(newOrderSnap, oldOrderSnap, user)
    }
    return newOrderSnap
  }

  async post(req: Request, res: Response, next: NextFunction, schema: ObjectSchema) {
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

  async put(req: Request, res: Response, next: NextFunction, schema: ObjectSchema) {
    const id = req.params.id // the id here should be the tracking number for the order
    let orderSnap = req.body as order

    // query for latest order snapshot status
    const { data, error } = await this.supabase.from(this.tableName)
      .select('id, status')
      .match({ order_id: id })
      .order('created_at', { ascending: false })
      .limit(1)

    if (data) {
      const [snap] = data // [ { status: 'accepted' } ]
      const currentSnap = snap as order
      const confirmingUser = req.user?.id || 'null'
      let transformOrder
      try {
        transformOrder = this._snapshotCreate(orderSnap, currentSnap, confirmingUser)
      } catch (error: any) {
        console.log(error)
        const err: ErrorObject = { message: `Invalid request body sent, can't transform order`, code: 400 }
        return next(err)
      }
      const { data: newSnap, error } = await this.supabase.from(this.tableName)
        .insert([transformOrder])

      if (error) {
        const code = codeMapper.get(error.code) || 500
        const err: ErrorObject = { message: error.message, code: code }
        return next(err)
      }
      return res.status(200).json(newSnap[0])
    }
    return res.status(404).json({ message: 'Invalid request sent, no order found', code: 404 })
  }

  // TODO: reject request to make edits to order requests
}
