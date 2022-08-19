import joi from "joi"

export const farmSchema = joi.object({
    owner_id: joi.string().required(),
    name: joi.string().required(),
    address: joi.string().required(),
    phone_number_1: joi.string().min(11).max(18).required(),
    state: joi.string().required(),
    lga: joi.string().required(),
    phone_number_2: joi.string().min(11).max(18),
    coordinate: joi.object(), //.required(),
    land_measurement: joi.object(),
})

// land_measurement: 18 m × 36 m = 648 sqm => 1 plot
export interface coordinate {
    lat: number | null,
    long: number | null,
}

export interface farm {
    owner_id: string,
    name: string,
    address: string,
    state: string,
    lga: string,
    phone_number_1: string,
    phone_number_2: string | null,
    coordinate: coordinate | null,
    land_measurement: object | null
}
