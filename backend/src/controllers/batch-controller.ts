import { NextFunction, Request, Response } from 'express'
import { batchSchema } from '../schema/batch-schema'
import { getBatchQuery } from '../queries/batch-queries'
import BaseController from './base/base-controller'

const baseControl: BaseController = new BaseController('batch')

export const createBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.post(req, res, next, batchSchema)
}

export const getBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.get(req, res, next, getBatchQuery())
}

export const deleteBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.delete(req, res, next)
}

export const updateBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await baseControl.patch(req, res, next)
}
