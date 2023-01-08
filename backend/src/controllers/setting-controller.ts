import BaseController from './base/base-controller'
import { Request, Response, NextFunction } from 'express'
import { settingSchema } from '../schema/setting-schema'

const baseControl = new BaseController('farm_setting', 'setting')

export const getSetting = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.get(req, res, next)
}

export const uploadSetting = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.post(req, res, next, settingSchema)
}

export const updateSetting = (req: Request, res: Response, next: NextFunction) => {
  return baseControl.patch(req, res, next, ['farm_id'])
}
