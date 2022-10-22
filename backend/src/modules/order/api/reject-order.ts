import { OrderStatus } from '../../../schema/enums'
import { order } from '../../../schema/order-schema'

export const rejectOrder = (order: order, user: string): order => {
  if (!order.is_complete && order.status === OrderStatus.request) {
    order.is_complete = true
    order.status = OrderStatus.rejected
    order.closed_by = user,
    order.closed_at = new Date().toJSON()
  }
  return order
}
