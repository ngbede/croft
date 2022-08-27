import joi from "joi"

export const userSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    phone_number: joi.string().max(18).required(),
    phone_number2: joi.string().max(18).default(null),
    date_of_birth: joi.date(),
    role: joi.string().required()
})

export interface user {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone_number: string,
    phone_number2: string | null,
    date_of_birth: string,
    role: string
}
