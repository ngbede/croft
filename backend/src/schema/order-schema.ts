import joi from 'joi'

export const orderSchema = joi.object({
  farm_id: joi.string().required().length(36),
  shipping_address: joi.object().required(),
  payment_method: joi.string().required().max(30),
  delivery_method: joi.string().required().max(30),
  pickup_address: joi.object(),
  phone_number_1: joi.string().max(20).required(),
  phone_number_2: joi.string().max(20),
  coordinate: joi.string(),
  items: joi.object().required(),
  total_amount: joi.number().required(),
  note: joi.string(),
  created_by: joi.string().required().length(36),
  updated_by: joi.string(),
})

export interface order {
  id?: string
  farm_id: string
  shipping_address: object
  payment_method: string
  delivery_method: string
  pickup_address: object
  phone_number_1: string
  phone_number_2: string
  status: string
  order_id: string
  coordinate: string
  items: object
  total_amount: number
  note: string | null
  is_complete: boolean
  closed_by: string | null
  closed_at: string | null
  created_by: string
  updated_by: string
  parent_snapshot?: string
}
