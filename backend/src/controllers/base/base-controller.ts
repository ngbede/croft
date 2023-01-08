import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import validator from 'validator'
import { supabase, supabaseServer } from '../../db/init'
import { pgInstance } from '../../db/pg'
import parseErrors from '../../utils/parse-validation-errors'
import ErrorObject, { codeMapper } from '../../schema/error'
import { SupabaseClient } from '@supabase/supabase-js'
import { filter } from '../../schema/filter'

export default class BaseController {
  tableName: string
  nameSpace: string
  supabase: SupabaseClient

  constructor(tableName: string, nameSpace?: string) {
    this.tableName = tableName
    this.nameSpace = nameSpace || tableName
    this.supabase = this.nameSpace === 'user' ? supabaseServer : supabase
  }

  // helper methods prefixed with _
  _parseUUID(id: string, next: NextFunction): boolean | void {
    const isValidUUID = validator.isUUID(id)
    if (!isValidUUID) {
      const error: ErrorObject = { message: 'Invalid uuid sent', code: 404 }
      next(error)
    }
    return isValidUUID
  }

  _validateBody(body: any, next: NextFunction, schema: ObjectSchema): boolean {
    let valid: boolean = true
    const { error: validationError } = schema.validate(body, {
      abortEarly: false,
    })
    const errors = parseErrors(validationError)

    if (errors.length > 0) {
      valid = !valid
      const error: ErrorObject = {
        message: 'validation failed on request body',
        code: 422,
        error: errors,
      }
      next(error)
    }
    return valid
  }

  async _runCustomQuery(query: string, args: string[], res: Response, next: NextFunction, listOfJson?: boolean) {
    try {
      const response = await pgInstance.query(query, args)
      if (response.rowCount > 0) {
        return res.status(200).json(listOfJson ? response.rows : response.rows[0])
      } else {
        return res.status(404).json({
          message: `Unable to fetch data for given ${this.nameSpace}`,
        })
      }
    } catch (error: any) {
      const err: ErrorObject = { code: 500, error: `${error}` }
      return next(err)
    }
  }

  _rejectPatchColumns(reqBody: any, next: NextFunction, invalidCols?: string[]): boolean {
    const bodyKeys: string[] = Object.keys(reqBody)
    const columns: string[] = ['id', 'order_id', 'total_amount'].concat(invalidCols || [])
    let invalidReq = bodyKeys.some(el => columns.includes(el))
    if (invalidReq) {
      const error: ErrorObject = {
        message: 'Invalid request, cant update specified columns in request body',
        code: 400,
        error: columns
      }
      next(error)
    }
    return !invalidReq
  }

  async get(req: Request, res: Response, next: NextFunction, query?: string) {
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
      if (!this._parseUUID(id, next)) return
      if (query) return this._runCustomQuery(query, [id], res, next)

      // continue with regular data fetching using id via supabase client
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .match({ id: id })
      if (error) {
        const err: ErrorObject = { code: 500, error: error }
        return next(err)
      }
      if (data.length > 0) return res.status(200).json(data[0])
      return res
        .status(200)
        .json({ message: `No ${this.nameSpace} with id ${id} found` })
    }

    // if there is a custom query and no id or filter list is given in request
    // then simply run the query provided
    // please ensure custom query is properly written to avoid any issue with data
    // TODO: figure out how to parse the args properly
    if (query && (!id && Object.keys(filters).length === 0)) return this._runCustomQuery(query, [], res, next, true)

    // get list of docs using query filters
    // this doesn't handle getting data via any custom query, will need to think that through
    if (!id && Object.keys(filters).length > 0) {
      const startDate = new Date('2022-01-01').toJSON() // minimum date to query possible data
      const defaultLimit = 100
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .match({ ...filters })
        .order(orderBy || 'created_at')
        .gte(range || 'created_at', rangeFrom || `${startDate}`)
        .limit(limit || defaultLimit)

      if (error) {
        const err: ErrorObject = { code: 500, error: error.message }
        return next(err)
      }
      return res.status(200).json(data)
    }
    return res.status(200).json([]) // return empty list if all checks above fail
  }

  async post(
    req: Request,
    res: Response,
    next: NextFunction,
    schema: ObjectSchema
  ) {
    const { body } = req
    // validate request body
    const valid: boolean = this._validateBody(body, next, schema)

    if (valid) {
      const { data, error } = await this.supabase.from(this.tableName).insert([body])
      if (error) {
        const errCode = codeMapper.get(error.code) ?? 500
        const err: ErrorObject = {
          message: error.message,
          code: errCode,
          error: error.details,
        }
        return next(err)
      } else {
        return res
          .status(200)
          .json({ message: `New ${this.nameSpace} created`, data: data[0] })
      }
    }
  }

  async patch(
    req: Request,
    res: Response,
    next: NextFunction,
    columns?: string[] // columns to exclude from patch update
  ) {
    const id = req.params.id
    const { body } = req

    // reject request process if validation pipe fails
    if (!this._parseUUID(id, next)) return
    if (!this._rejectPatchColumns(body, next, columns)) return

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ ...body, updated_at: new Date().toJSON() })
      .match({ id: id })

    if (error) {
      // Postgrest doesn't return any error object for some reason
      console.error(error)
      const err: ErrorObject = {
        message: error.message,
        code: 400,
        error: error.details,
      }
      return next(err)
    } else {
      return res.status(200).json(data)
    }
  }

  async put(req: Request, res: Response, next: NextFunction, schema: ObjectSchema): Promise<void | Response> {
    const error: ErrorObject = { message: 'Implement your own custom put method on extended class!', code: 500 }
    next(error)
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    if (!this._parseUUID(id, next)) return

    const { data, error } = await this.supabase
      .from(this.tableName)
      .delete()
      .match({ id: id })

    if (error) {
      const err: ErrorObject = {
        message: error.message,
        code: 400,
        error: error.details,
      }
      return next(err)
    }

    if (data.length > 0)
      return res.status(200).json({
        message: `${this.nameSpace} successfully deleted`,
        data: data,
      })
    return res
      .status(200)
      .json({ message: `No ${this.nameSpace} with id ${id} found` })
  }
}
