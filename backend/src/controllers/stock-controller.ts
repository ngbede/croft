import { NextFunction, Request, Response } from "express"
import { supabase } from "../db/init"
import validator from "validator"
import parseErrors from "../utils/parse-validation-errors"
import { stock, stockSchema } from "../schema/stock-schema"
import { getStockInfo } from "../queries/stock-queries"
import { StockOperations, StockTypes } from "../schema/enums"
import BaseController from "./base-controller"

const baseControl: BaseController = new BaseController("stock_report", "stock count")

export const createStock = async (req: Request, res: Response) => {
    // add a check to prevent duplicate stock-count per day i.e one stock count doc per day per farm for diff stock types
    const { error: validationError, value } = stockSchema.validate(req.body, {abortEarly: false})
    const errors = parseErrors(validationError)

    if (errors.length > 0) {
        return res.status(422).json({
            message: "validation failed on request body", 
            errors: errors
        })
    }
    const newStock: stock = value

    const { data: fetchStock, error: fetchError } = await supabase.from("stock_report").select(`*`).match({farm_id: newStock.farm_id})

    if (fetchError) {
        console.error(fetchError)
        return res.status(500).json({message: "Internal server error: unable to fetch data", error: fetchError})
    }

    if (fetchStock.length > 0) {
        let duplicateId = ''
        const dates: string[] = fetchStock.map( (e : stock) => {
            duplicateId = e.id
            return new Date(e.created_at).toDateString()
        })
        const currentDate = new Date
        const parseDate: string = currentDate.toDateString()

        // check if there is a stock record for the current day
        const dateExists: boolean = dates.includes(parseDate)
        if (dateExists) {
            return res.status(400).json({
                message: "Duplicate stock count records for same day not allowed",
                duplicateId: `${duplicateId}`
            })
        }
        const { data, error } = await supabase.from("stock_report").insert([newStock])
        if (error) {
            error.message = error.message.replace('\"', "'").replace('\"', "'")
            return res.status(404).json(error)
        }
        if (data.length > 0) return res.status(200).json(data[0])

    } else { // no stock record for same day, then proceed with insert
        const { data, error } = await supabase.from("stock_report").insert([newStock])
        if (error) {
            error.message = error.message.replace('\"', "'").replace('\"', "'")
            return res.status(404).json(error)
        }
        if (data.length > 0) return res.status(200).json(data[0])
    }
}

export const deleteStock = async (req: Request, res: Response, next: NextFunction) => {
    return await baseControl.delete(req, res, next)
}

export const getStock = async (req: Request, res: Response, next: NextFunction) => {
    return await baseControl.get(req, res, next, getStockInfo())
}

export const updateStock = async (req: Request, res: Response) => {
    const id = req.params.id
    const isValidUUID = validator.isUUID(id)
    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }

    /**
     * OPERATION TYPES:
     * - add new object to stock field
     * - remove object from stock field
     * 
     * USE CASES
     * - egg stock count removal and addition pathces just works.
     * - chicken count: next
     */

    // get stock type
    let stockData = req.body.type === StockTypes.eggCount ? "egg_count" : "chicken_count"

    const { data, error } = await supabase.from("stock_report").select(stockData).match({ id: id })

    if ( error ){
        console.error(error)
        return res.status(500).json({message: "Internal server error", error: error})
    }

    // TODO: model data properly
    if (data.length > 0 && Object.keys(data[0]).includes(stockData)) {
        if (req.body.operation === StockOperations.add) {
            const copyData: Array<object> = data[0][stockData]
            console.log(copyData)
            req.body.data.forEach( (e: object) => {
                copyData.push(e)
            })
            if (stockData === "egg_count"){
                const { data: updateData, error: updateError } = await supabase.from("stock_report").update({
                    egg_count: copyData
                }).match({id: id})
                console.log(updateError)
                
                return res.status(200).json(updateData)
            }
        }
        
        // return res.status(200).json(copyData)
    }
    
    return res.status(200).json(isValidUUID)    
}
