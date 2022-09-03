import { Request, Response, NextFunction } from 'express'
import ErrorObject from '../../schema/error'
import { supabaseServer } from '../../db/init'

const authenticator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken = req.get('Authorization')
  if (!jwtToken) {
    const error: ErrorObject = {
      message: 'Invalid request, access token missing',
      code: 404,
    }
    return next(error)
  }

  const { data, error } = await supabaseServer.auth.api.getUser(jwtToken)
  if (error) {
    const err: ErrorObject = { message: error.message, code: error.status }
    return next(err)
  }

  if (data) {
    req.user = data
  } else {
    const err: ErrorObject = {
      message: 'Access token failed to authenticate',
      code: 400,
    }
    return next(err)
  }
  next()
}

export default authenticator
