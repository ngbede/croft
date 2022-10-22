import BaseController from './base/base-controller'
import { Request, Response, NextFunction } from 'express'
import { settingSchema } from '../schema/setting-schema'

const baseControl: BaseController = new BaseController('farm_setting', 'setting')

export const getSetting = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.get(req, res, next)
}

export const uploadSetting = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.post(req, res, next, settingSchema)
}

export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  return await baseControl.patch(req, res, next)
}
