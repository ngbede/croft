import { OrderStatus } from '../../../schema/enums'
import { order } from '../../../schema/order-schema'

export const packOrder = (orderSnap: order, user: string) => {
  if (!orderSnap.is_complete && orderSnap.status === OrderStatus.accepted) {
    orderSnap.status = OrderStatus.packed
    

  }
}