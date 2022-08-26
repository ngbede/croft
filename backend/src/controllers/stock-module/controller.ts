import { Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi"
import { stock } from "../../schema/stock-schema"
import BaseController from "../base-controller"
import { farm } from "../../schema/farm-schema"
import { createStockID } from "../../api/write/stock-id"
import ErrorObject, { codeMapper } from "../../schema/error"

export default class StockController extends BaseController {
    constructor (tableName: string, nameSpace?: string) {
        super(tableName, nameSpace)
    }

    async post (req: Request, res: Response, next: NextFunction, schema: ObjectSchema) {
        const stock: stock = req.body
        // validate request body        
        const valid: boolean = this._validateBody(stock, next, schema)

        if (valid) {
            const { data, error } = await this.api.from<farm>('farms').select('name').match({id: stock.farm_id})
            if (error) {
                console.error(error)
                return next(error)
            }
            // TODO: check this stuff could be null
            const name = data![0].name
            const [stockID, created_at] = createStockID(name)
            const { data: newStock, error: err } = await this.api.from<stock>('stock_report')
                .insert([{
                    ...stock,
                    stockid: stockID, 
                    created_at: created_at, 
                    updated_at: created_at
                }])

            if (err) {
                const e: ErrorObject = {message: err.message, code: codeMapper.get(err.code) || 404}
                return next(e)
            }
            return res.status(200).json(newStock)
        }
    }
}