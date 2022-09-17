import joi from 'joi'

export const orderSchema = joi.object({
  farm_id: joi.string().required(),
  shipping_address: joi.object().required(),
  payment_method: joi.string().required().length(30),
  delivery_method: joi.string().required().length(30),
  pickup_address: joi.object(),
  phone_number_1: joi.string().length(20).required(),
  phone_number_2: joi.string().length(20),
  coordinate: joi.string(),
  items: joi.object().required(),
  total_amount: joi.number().required(),
  note: joi.string(),
  created_by: joi.string().required(),
  updated_by: joi.string(),
})

