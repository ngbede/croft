import joi from "joi"

export const settingSchema = joi.object({
    farm_id: joi.string().required(),
    crate_price: joi.array().required(),
    chicken_price: joi.object().required(),
    eggs_per_crate: joi.number().required().default(30)
})

export interface setting {
    farm_id: string,
    crate_price: number,
    chicken_price: object,
    eggs_per_crate: number
}
