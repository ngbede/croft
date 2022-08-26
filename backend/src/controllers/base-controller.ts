import { Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi"
import validator from "validator"
import { supabase, supabaseServer } from "../db/init"
import { pgInstance } from "../db/pg"
import parseErrors from "../utils/parse-validation-errors"
import ErrorObject, { codeMapper } from "../schema/error"
import { SupabaseClient } from "@supabase/supabase-js"
import { filter } from "../schema/filter"

export default class BaseController {
    tableName: string
    nameSpace: string
    api: SupabaseClient

    constructor(tableName: string, nameSpace?: string) {
        this.tableName = tableName
        this.nameSpace = nameSpace || tableName
        this.api = this.nameSpace === 'user' ? supabaseServer : supabase
    }

    // helper methods prefixed with _
    _parseUUID (id: string, next: NextFunction) {
        const isValidUUID = validator.isUUID(id)
         if (!isValidUUID) {
            const error: ErrorObject = { message: "Invalid uuid sent", code: 404}
            return next(error)
        }
    }

    _validateBody (body: any, next: NextFunction, schema: ObjectSchema): boolean {
        let valid: boolean = true
        const {error: validationError} = schema.validate(body, {abortEarly: false})
        const errors = parseErrors(validationError)

        if (errors.length > 0) {
            valid = !valid
            const error: ErrorObject = {message: "validation failed on request body", code: 422, error: errors}
            next(error)
        }
        return valid
    }

    async get(req:Request, res: Response, next: NextFunction, query?: string) {
       const id = req.params.id
       const f = req.query
       const filters: filter = f
       const { orderBy, range, rangeFrom: rangeFrom, desc, limit } = filters
       // clean up filters
       delete filters.desc
       delete filters.orderBy
       delete filters.range
       delete filters.limit
       delete filters.rangeFrom

       if (id) {
        this._parseUUID(id, next)
         // run custom queries directly on PG
         if (query) {
            try {
                const response = await pgInstance.query(query, [id])
                if (response.rowCount > 0) {
                    return res.status(200).json(response.rows[0])
                } else {
                    return res.status(404).json({message: `Unable to fetch data for given ${this.nameSpace} with id ${id}`})
                } 
            } catch (error: any) {
                const err: ErrorObject = {code: 500, error: `${error}`}
                return next(err)
            }
         } else {
            const { data, error } = await this.api.from(this.tableName).select("*").match({id: id})
            if (error) {
                const err: ErrorObject = {code: 500, error: error}
                return next(err)
            }
            if (data.length > 0) return res.status(200).json(data[0])
            return res.status(200).json({message: `No ${this.nameSpace} with id ${id} found`})
         }
       } 

       // get list of docs using query filters
       if (!id && Object.keys(filters).length > 0) {
          const startDate = new Date('2022-01-01').toJSON() // minimum date to query possible data
          const defaultLimit = 100 
          const { data, error } = await this.api.from(this.tableName)
            .select('*')
            .match({...filters})
            .order(orderBy || 'id')
            .gte(range || 'created_at', rangeFrom || `${startDate}`)
            .limit(limit || defaultLimit)

          if (error) {
            const err: ErrorObject = {code: 500, error: error.message}
            return next(err)
          }
          return res.status(200).json(data)
       }
       return res.status(200).json([]) // return empty list if all checks above fail
    }

    async post(req:Request, res: Response, next: NextFunction, schema: ObjectSchema) {
        const { body } = req
        // validate request body
        const valid: boolean = this._validateBody(body, next, schema)

        if (valid) {
            const { data, error } = await this.api.from(this.tableName).insert([body])
            if (error) {
                const errCode = codeMapper.get(error.code) ?? 500
                const err: ErrorObject = {message: error.message, code: errCode, error: error.details}
                return next(err)
            } else {
                return res.status(200).json({message: `New ${this.nameSpace} created`, data: data[0]})
            }
        }
    }

    async patch(req:Request, res: Response, next: NextFunction, columns?: string[]) {
        const id = req.params.id
        const { body } = req
        this._parseUUID(id, next)

        const { data, error } = await this.api.from(this.tableName)
        .update({...body, updated_at: new Date().toJSON()})
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
        this._parseUUID(id, next)

        const { data, error } = await this.api.from(this.tableName).delete().match({id: id})

        if (error) {
            const err: ErrorObject = { message: error.message, code: 400, error: error.details}
            return next(err)
        }

        if (data.length > 0) return res.status(200).json({message: `${this.nameSpace} successfully deleted`, data: data})
        return res.status(200).json({message: `No ${this.nameSpace} with id ${id} found`})
    }
}
