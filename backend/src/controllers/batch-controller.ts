import { NextFunction, Request, Response } from 'express'
import { batchSchema } from '../schema/batch-schema'
import { getBatchQuery } from '../queries/batch-queries'
import BaseController from './base/base-controller'

const baseControl = new BaseController('batch')

export const createBatch = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.post(req, res, next, batchSchema)
}

export const getBatch = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.get(req, res, next, getBatchQuery())
}

export const deleteBatch = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.delete(req, res, next)
}

export const updateBatch = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.patch(req, res, next)
}
