import joi from "joi"

export const stockSchema = joi.object({
    farm_id: joi.string().required(),
    batch_id: joi.string().required(),
    created_by: joi.string().required(),
    type: joi.string().required(),
    chicken_count: joi.array().required(),
    egg_count: joi.array().required(),
    comment: joi.array().required()
})

export interface stock {
    id: string,
    farm_id: string,
    batch_id: string,
    created_by: string,
    type: string,
    chicken_count: object,
    egg_count: object[],
    comment: object[],
    created_at: string
}