import { NextFunction, Request, Response } from 'express'
import ErrorObject from '../schema/error'

const errorHandle = (
  error: ErrorObject,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error)
  // TODO: there is a weired error that happens here, watch this space
  const err: number = error.code || 500
  const stringifyErr: string = err.toString()

  if (stringifyErr.startsWith('5')) {
    delete error.error
    error.message = 'Internal server error'
    error.code = err
  } else if (!error.message && stringifyErr.startsWith('4')) {
    error.message = 'Invalid request sent, check request params & body'
  }
  error.message = error.message ?? 'An error occured please contact support'
  return res.status(err).json(error)
}

export default errorHandle
