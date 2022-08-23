import { Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi"
import validator from "validator"
import { supabase } from "../db/init"
import { pgInstance } from "../db/pg"
import parseErrors from "../utils/parse-validation-errors"

export default class BaseController {
    tableName: string
    query: string
    nameSpace: string

    constructor(tableName: string, query: string, nameSpace: string) {
        this.tableName = tableName
        this.query = query
        this.nameSpace = nameSpace
    }

    async get(req:Request, res: Response, next: NextFunction) {
       const id = req.params.id

       if (id) {
         const isValidUUID = validator.isUUID(id)
         if (!isValidUUID) {
            const error: Object = { message: "Invalid uuid sent", status: 404}
            return next(error)
         }

         // run custom queries directly on PG
         if (this.query.length >= 1) {
            try {
                const response = await pgInstance.query(this.query, [id])
                console.log(response)
                if (response.rowCount > 0) {
                    return res.status(200).json(response.rows)
                } else {
                    return res.status(404).json({message: `Unable to fetch data for given ${this.nameSpace} with id ${id}`})
                } 
            } catch (error: any) {
                console.error(error)
                error.status = 500
                return next(error)
            }
         } else {
            const { data, error } = await supabase.from(this.tableName).select("*").match({id: id})
            if (error) {
                console.error(error)
                return res.status(500).json({message: "Internal server error, unable to fetch data"})
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
            const error: Object = {message: "validation failed on request body", status: 422, errors: errors}
            return next(error)
        }

        const { data, error } = await supabase.from(this.tableName).insert([body])

        if (error) {
            console.error(error)
            return next(error)
        } else {
            return res.status(200).json({message: `New ${this.nameSpace} craeted`, data: data[0]})
        }
    }
    
    async patch(req:Request, res: Response, next: NextFunction) {
        const id = req.params.id
        const { body } = req
        if (!validator.isUUID(id)) {
            const error: Object = { message: "Invalid uuid sent", status: 404}
            return next(error)
        }

        const { data, error } = await supabase.from(this.tableName)
        .update({body})
        .match({id: id})
        
        if (error) {
            return res.status(400).json(error)
        } else {
            return res.status(200).json(data)
        }
    }

    async delete(req:Request, res: Response, next: NextFunction) {
        const id = req.params.id
        if (!validator.isUUID(id)) {
            const error: Object = { message: "Invalid uuid sent", status: 404}
            return next(error)
        }

        const { data, error } = await supabase.from(this.tableName).delete().match({id: id})

        if (error) {
            return res.status(400).json(error)
        }
        return res.status(200).json(data)
    }
}
