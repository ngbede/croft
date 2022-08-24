import { Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi"
import validator from "validator"
import { supabase } from "../db/init"
import { pgInstance } from "../db/pg"
import parseErrors from "../utils/parse-validation-errors"
import ErrorObject from "../schema/error"

export default class BaseController {
    tableName: string
    nameSpace: string

    constructor(tableName: string, nameSpace: string) {
        this.tableName = tableName
        this.nameSpace = nameSpace
    }

    async get(req:Request, res: Response, next: NextFunction, query?: string) {
       const id = req.params.id

       if (id) {
         const isValidUUID = validator.isUUID(id)
         if (!isValidUUID) {
            const error: Object = { message: "Invalid uuid sent", status: 404}
            return next(error)
         }

         // run custom queries directly on PG
         if (query) {
            try {
                const response = await pgInstance.query(query, [id])
                if (response.rowCount > 0) {
                    return res.status(200).json(response.rows)
                } else {
                    return res.status(404).json({message: `Unable to fetch data for given ${this.nameSpace} with id ${id}`})
                } 
            } catch (error: any) {
                const err: ErrorObject = {code: 500, error: `${error}`}
                return next(err)
            }
         } else {
            const { data, error } = await supabase.from(this.tableName).select("*").match({id: id})
            if (error) {
                const err: ErrorObject = {code: 500, error: `${error}`}
                return next(err)
            }
            return res.status(200).json(data)
         }
       }

       // TODO: add a getList path here
    }

    async post(req:Request, res: Response, next: NextFunction, schema: ObjectSchema) {
        const { body } = req
        // validate request body
        const {error: validationError} = schema.validate(body, {abortEarly: false})
        const errors = parseErrors(validationError)

        if (errors.length > 0) {
            const error: ErrorObject = {message: "validation failed on request body", code: 422, error: errors}
            return next(error)
        }

        const { data, error } = await supabase.from(this.tableName).insert([body])

        if (error) {
            console.error(error)
            return next(error)
        } else {
            return res.status(200).json({message: `New ${this.nameSpace} created`, data: data[0]})
        }
    }
    
    async patch(req:Request, res: Response, next: NextFunction, columns?: string[]) {
        const id = req.params.id
        const { body } = req
        if (!validator.isUUID(id)) {
            const error: Object = { message: "Invalid uuid sent", status: 404}
            return next(error)
        }

        const { data, error } = await supabase.from(this.tableName)
        .update(body)
        .match({id: id})

        if (error) {
            // Postgrest doesn't return any error object for some reason
            console.error(error)
            const err: ErrorObject = { message: error.message, code: 400, error: error.details}
            return next(err)
        } else {
            return res.status(200).json(data)
        }
    }

    async delete(req:Request, res: Response, next: NextFunction) {
        const id = req.params.id
        if (!validator.isUUID(id)) {
            const error: ErrorObject = { message: "Invalid uuid sent", code: 404}
            return next(error)
        }

        const { data, error } = await supabase.from(this.tableName).delete().match({id: id})

        if (error) {
            const err: ErrorObject = { message: error.message, code: 400, error: error.details}
            return next(err)
        }

        if (data.length > 0) {
            return res.status(200).json({message: `${this.nameSpace} successfully deleted`, data: data})
        } else {
            return res.status(200).json({message: `No ${this.nameSpace} with id ${id} found`})
        }
    }
}
