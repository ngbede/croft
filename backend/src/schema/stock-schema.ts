import joi from 'joi'

export const stockSchema = joi.object({
  farm_id: joi.string().required(),
  batch_id: joi.string().required(),
  created_by: joi.string().required(),
  type: joi.string().required(),
  chicken_count: joi.object().required(),
  egg_count: joi.object().required(),
  comment: joi.string().required(),
})

export interface stock {
  id: string
  stockid: string
  farm_id: string
  batch_id: string
  created_by: string
  type: string
  chicken_count: object
  egg_count: object
  comment: string
  created_at: string
  updated_at: string
}
