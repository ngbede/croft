import validator from 'validator'
import { user } from '../../schema/user-schema'
import { Request, Response, NextFunction } from 'express'
import BaseController from '../../controllers/base/base-controller'
import ErrorObject from '../../schema/error'
import { ObjectSchema } from 'joi'
import { User } from '@supabase/supabase-js'
import { roles } from '../../schema/enums'
import { userDetailTable } from '../../utils/constants'

export default class UserController extends BaseController {
  constructor(tableName: string, nameSpace?: string) {
    super(tableName, nameSpace)
  }

  _userExist(email: string, userList: User[]): boolean {
    const user = userList.find((u) => email === u.email)
    return user !== undefined
  }

  _validateEmail(email: string) {
    return validator.isEmail(email)
  }

  async _listUsers(next: NextFunction) {
    const { data, error } = await this.supabase.auth.api.listUsers()
    if (error) {
      const err: ErrorObject = { message: error.message, code: error.status }
      next(err)
    }
    return data!
  }

  async get(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    if (!this._parseUUID(id, next)) return

    const { data, error } = await this.supabase.auth.api.getUserById(id)

    if (error) {
      const err: ErrorObject = { message: error.message, code: error.status }
      return next(err)
    }

    if (data) return res.status(200).json(data) // TODO: return certain fields
    return res
      .status(200)
      .json({ message: `No ${this.nameSpace} with id ${id} found` })
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction,
    schema: ObjectSchema
  ) {
    const newUser: user = req.body
    // validate request body
    const valid: boolean = this._validateBody(newUser, next, schema)
    newUser.roles = roles.get(newUser.user_role.toLowerCase()) // get default user_role list

    if (valid) {
      const { user, error } = await this.supabase.auth.api.createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
          user_role: newUser.user_role.toLowerCase(),
          roles: newUser.roles
        }
      })

      newUser.id = user?.id
      delete newUser.email
      delete newUser.password
      const { data, error: err } = await this.supabase.from(userDetailTable).insert([newUser])

      if (error) {
        const err: ErrorObject = { message: error.message, code: error.status }
        return next(err)
      }

      // TODO: figure out a way to add this to a queue using digital ocean functions
      await this.supabase.auth.api.sendMagicLinkEmail(newUser.email!, {
        shouldCreateUser: false,
      })
      return res.status(200).json({ ...user, user_detail: data })
    }
  }

  async passwordReset(req: Request, res: Response, next: NextFunction) {
    const userObject: user = req.body
    const isEmail = this._validateEmail(userObject.email!)

    if (isEmail) {
      const allUsers: User[] = await this._listUsers(next)
      const exist = this._userExist(userObject.email!, allUsers)
      if (exist) {
        const { error } = await this.supabase.auth.api.resetPasswordForEmail(
          userObject.email!
        )
        if (error) {
          const err: ErrorObject = {
            message: error.message,
            code: error.status,
          }
          return next(err)
        }
        return res
          .status(200)
          .json({ message: 'Email reset link sent, check your email' })
      }
      return next({ message: 'Email account does not exist', code: 422 })
    }
    return next({ message: 'Invalid email address', code: 400 })
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const userObject: user = req.body

    if (!userObject.email || !userObject.password) {
      return res.status(400).json({ message: "Both email & password is required" })
    }

    const { data, error } = await this.supabase.auth.api.signInWithEmail(
      userObject.email,
      userObject.password
    )
    if (error) {
      const err: ErrorObject = { message: error.message, code: error.status }
      return next(err)
    }
    return res.status(200).json(data)
  }

  // could require some more thinking
  async closeAccount() { }
}
