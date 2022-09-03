import { NextFunction, Request, Response } from 'express'
import ErrorObject from '../schema/error'

const errorHandle = (
  error: ErrorObject,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stringifyErr: string = error.code.toString()

  if (stringifyErr.startsWith('5')) {
    error.message = 'Internal server error'
  } else if (!error.message && stringifyErr.startsWith('4')) {
    error.message = 'Invalid request sent, check request params & body'
  }
  error.message = error.message ?? 'An error occured please contact support'
  return res.status(error.code).json(error)
}

export default errorHandle
