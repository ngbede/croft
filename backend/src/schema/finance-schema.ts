import joi from 'joi'

export const financeSchema = joi.object({
  order_id: joi.string().required(),
})
