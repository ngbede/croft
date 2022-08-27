export enum FarmRoles {
    stockReport = "stock-report",
    createBatch = "create-batch",
    editBatch = "edit-batch",
    deleteBatch = "delete-batch",
    manageUser = "manage-user",
    orders = "orders",
}

export const roles = new Map<string, string[]>([
    [
        "owner", [
            FarmRoles.createBatch,
            FarmRoles.deleteBatch,
            FarmRoles.manageUser,
            FarmRoles.orders,
            FarmRoles.stockReport
        ]
    ],
    [
        "employee", [
            FarmRoles.stockReport,
            FarmRoles.createBatch,
            FarmRoles.editBatch
        ]
    ],
    [
        "distributor", [
            FarmRoles.orders
        ]
    ]
])

export enum StockTypes {
    eggCount = "egg-count",
    chickenCount = "chicken-count"
}

export enum StockOperations {
    add = "add",
    delete = "delete"
}
