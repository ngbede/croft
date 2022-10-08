export enum FarmRoles {
  stockReport = 'stock-report',
  createBatch = 'create-batch',
  editBatch = 'edit-batch',
  deleteBatch = 'delete-batch',
  manageUser = 'manage-user',
  orders = 'orders',
}

export const roles = new Map<string, string[]>([
  [
    'owner',
    [
      FarmRoles.createBatch,
      FarmRoles.deleteBatch,
      FarmRoles.manageUser,
      FarmRoles.orders,
      FarmRoles.stockReport,
    ],
  ],
  [
    'employee',
    [FarmRoles.stockReport, FarmRoles.createBatch, FarmRoles.editBatch],
  ],
  ['distributor', [FarmRoles.orders]],
])

export enum StockTypes {
  eggCount = 'egg-count',
  chickenCount = 'chicken-count',
}

export enum StockOperations {
  add = 'add',
  delete = 'delete',
}

export enum OrderStatus {
  request = 'request', // from a normal user
  rejected = 'rejected', // farm can either reject
  accepted = 'accepted', // or accept the order request
  // create a new snapshot of the order from packed
  packed = 'packed', // if accepted farm should get the items listed in order packed & ready.

  // transit status subtracts from the farms current stock
  transit = 'in-transit', // at this point, once in transit we should have an estimate of when the items will arrive at their destination. 
  received = 'received' // the items have reached final destination and the order is finally complete
}
