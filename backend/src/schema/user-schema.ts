import joi from 'joi'

export const userSchema = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  phone_number: joi.string().max(18).required(),
  phone_number2: joi.string().max(18).default(null),
  user_role: joi.string().required(),
})

export interface user {
  id?: string,
  first_name: string
  last_name: string
  email?: string
  password?: string
  phone_number: string
  phone_number2: string | null
  user_role: string,
  roles: string[] | undefined
}
