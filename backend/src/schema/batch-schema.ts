import joi from 'joi'

export const batchSchema = joi.object({
  created_by: joi.string().required(),
  farm_id: joi.string().required(),
  name: joi.string().max(50).required(),
  active: joi.boolean(),
  bird_category: joi.string().max(10).required(),
  initial_population: joi.number().required(),
  total_cost: joi.number().required(),
})

export interface batch {
  created_by: string
  farm_id: string
  name: string
  active: boolean
  bird_category: string
  initial_population: number
  total_cost: number
}
