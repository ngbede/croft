import validator from 'validator'
import { user } from '../../schema/user-schema'
import { Request, Response, NextFunction } from 'express'
import BaseController from '../base-controller'
import ErrorObject from '../../schema/error'
import { ObjectSchema } from 'joi'
import { User } from '@supabase/supabase-js'
import { roles } from '../../schema/enums'

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
    const { data, error } = await this.api.auth.api.listUsers()
    if (error) {
      const err: ErrorObject = { message: error.message, code: error.status }
      next(err)
    }
    return data!
  }

  async get(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    this._parseUUID(id, next)

    const { data, error } = await this.api.auth.api.getUserById(id)

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

    if (valid) {
      const { user, error } = await this.api.auth.api.createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          phone_number: newUser.phone_number,
          phone_number2: newUser.phone_number2,
          date_of_birth: newUser.date_of_birth,
          user_role: newUser.role,
          roles: roles.get(newUser.role.toLowerCase()),
        },
      })

      if (error) {
        const err: ErrorObject = { message: error.message, code: error.status }
        return next(err)
      }

      // TODO: figure out a way to add this to a queue using digital ocean functions
      await this.api.auth.api.sendMagicLinkEmail(newUser.email, {
        shouldCreateUser: false,
      })
      return res.status(200).json(user)
    }
  }

  async passwordReset(req: Request, res: Response, next: NextFunction) {
    const userObject: user = req.body
    const isEmail = this._validateEmail(userObject.email)

    if (isEmail) {
      const allUsers: User[] = await this._listUsers(next)
      const exist = this._userExist(userObject.email, allUsers)
      if (exist) {
        const { error } = await this.api.auth.api.resetPasswordForEmail(
          userObject.email
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

    // if (!userObject.email || !userObject.password) return res.status(400).json({message: "Both email & password is required"})

    const { data, error } = await this.api.auth.api.signInWithEmail(
      userObject.email,
      userObject.password
    )
    if (error) {
      console.log(error)

      const err: ErrorObject = { message: error.message, code: error.status }
      return next(err)
    }
    const { data: d, error: e } = await this.api.auth.api.inviteUserByEmail(
      'emma.ngbede.sule@gmail.com',
      { data: { fish: 'lol, nigeria' } }
    )
    await this.api.auth.api.resetPasswordForEmail('emma.ngbede.sule@gmail.com')
    console.log(d)
    console.log(e)
    return res.status(200).json(data)
  }

  // could require some more thinking
  async closeAccount() {}
}
