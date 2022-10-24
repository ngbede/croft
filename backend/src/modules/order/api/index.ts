import { OrderStatus } from '../../../schema/enums'
import { order } from '../../../schema/order-schema'

const errMessage = (status: string) => `invalid order snapshot can't be moved to status '${status}'`

export const rejectOrder = (orderSnapshot: order, user: string) => {
  if (!orderSnapshot.is_complete && orderSnapshot.status === OrderStatus.request) {
    orderSnapshot.is_complete = true
    orderSnapshot.status = OrderStatus.rejected
    orderSnapshot.closed_by = user
    orderSnapshot.closed_at = new Date().toJSON()
    orderSnapshot.parent_snapshot = orderSnapshot.id
    return orderSnapshot
  }
  throw new Error(errMessage(OrderStatus.rejected))
}

export const acceptOrder = (orderSnapshot: order, user: string) => {
  if (!orderSnapshot.is_complete && orderSnapshot.status === OrderStatus.request) {
    orderSnapshot.status = OrderStatus.accepted
    orderSnapshot.closed_by = user
    orderSnapshot.parent_snapshot = orderSnapshot.id
    return orderSnapshot
  }
  throw new Error(errMessage(OrderStatus.accepted))
}

export const packOrder = (orderSnapshot: order, oldOrderSnap: order, user: string) => {
  // TODO: add logic for final qty packed from the farm
  if (!orderSnapshot.is_complete && oldOrderSnap.status === OrderStatus.accepted) {
    orderSnapshot.status = OrderStatus.packed
    orderSnapshot.created_by = user
    orderSnapshot.parent_snapshot = oldOrderSnap.id
    return orderSnapshot
  }
  throw new Error(errMessage(OrderStatus.packed))
}

export const transitOrder = (orderSnapshot: order, oldOrderSnap: order, user: string) => {
  // TODO: add expected delivery date
  // TODO: add delivery fee
  // at this point the farm items have left the farm
  if (!orderSnapshot.is_complete && oldOrderSnap.status === OrderStatus.packed) {
    orderSnapshot.status = OrderStatus.transit
    orderSnapshot.created_by = user
    orderSnapshot.parent_snapshot = oldOrderSnap.id
    return orderSnapshot
  }
  throw new Error(errMessage(OrderStatus.transit))
}

export const receiveOrder = (orderSnapshot: order, oldOrderSnap: order, user: string) => {
  if (!orderSnapshot.is_complete && oldOrderSnap.status === OrderStatus.transit) {
    orderSnapshot.status = OrderStatus.received
    orderSnapshot.is_complete = true
    orderSnapshot.created_by = user
    orderSnapshot.parent_snapshot = oldOrderSnap.id
    return orderSnapshot
  }
  throw new Error(errMessage(OrderStatus.received))
}
