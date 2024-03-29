import { ChickenTypes, OrderStatus } from '../../../schema/enums'
import { farmConfig } from '../../../schema/farm-schema'
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

// it is at this point that we expect payment to happen before the deilvery is done i.e `in-transit` state
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

export const tallyOrderPrices = (config: farmConfig, orderDoc: order): order => {
  // we expect the last element in the array to be the current price
  const latestEggPrice = config.crate_price.pop()
  const latestChickenPrice = config.chicken_price.pop()
  let totalAmount = 0

  if (orderDoc.items.eggs) {
    let cratePrice: number = orderDoc.items.eggs.crates * (latestEggPrice?.price || 0)
    let totalEggs: number = orderDoc.items.eggs.crates * config.eggs_per_crate
    orderDoc.items.eggs.total_cost = cratePrice
    orderDoc.items.eggs.total_eggs = totalEggs
    orderDoc.items.eggs.eggs_per_crate = config.eggs_per_crate
    orderDoc.items.eggs.unit_price = latestEggPrice?.price
    totalAmount += cratePrice
  }

  if (orderDoc.items.chickens) {
    let currentChickPrice
    orderDoc.items.chickens.forEach(chick => {
      if (chick.type === ChickenTypes.layers) {
        currentChickPrice = latestChickenPrice?.layers || 0
      } else {
        currentChickPrice = latestChickenPrice?.broilers || 0
      }
      chick.total_cost = chick.quantity * currentChickPrice
      chick.unit_price = currentChickPrice
      totalAmount += chick.total_cost
    })
  }

  orderDoc.total_amount = totalAmount
  return orderDoc
}
