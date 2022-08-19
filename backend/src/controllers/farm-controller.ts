import { supabase, supabaseServer } from "../db/init"
import parseErrors from "../utils/parse-validation-errors"
import validator from "validator"
import { Request, Response } from "express"
import { farmSchema, farm, coordinate } from "../schema/farm-schema"

export const registerFarm =async ( req: Request, res: Response ) => {
    const {error: validationError, value} = farmSchema.validate(req.body, {abortEarly: false})
    const errors = parseErrors(validationError)
    
    if (errors.length > 0) {
        return res.status(422).json({
            message: "validation failed on request body", 
            errors: errors
        })
    }

    const newFarm: farm = value
    const { data, error } = await supabase.from("farms").insert([newFarm])
    
    if (error) {
        error.message = error.message.replace('\"', "'").replace('\"', "'")
        return res.status(404).json(error)
    }

    if (data.length > 0) return res.status(200).json(data[0])
}

export const deleteFarm = async (req: Request, res: Response) => {
    const id = req.params.id
    const isValidUUID = validator.isUUID(id)
    
    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }
    
    const { data, error } = await supabase.from("farms").delete().match({id: id})
    
    if (error) {
        console.error(error)
        return res.status(500).json({message: "Internal server error"})
    }

    if (data.length > 0){
        return res.status(200).json({message: `Farm with id ${id} deleted`, data: data})
    } else {
        return res.status(400).json({message: `No farm with specified id ${id} exist`})
    }
}

export const updateFarm = async (req: Request, res: Response) => {
    const id = req.params.id
    const newData: farm = req.body
    const isValidUUID = validator.isUUID(id)
    
    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }

    /**
     * update
     * - coordinate
     * - land_measurement
     * - phone_number_1
     * - address
     * - phone_number_2
     * - state
     * - lga
     */

    const { data: oldData, error: selectErr} = await supabase.from("farms").select(
        `address, 
        coordinate, 
        land_measurement, 
        phone_number_1, 
        phone_number_2, 
        state, 
        lga`
    ).match({id: id})

    
    if (selectErr) {
        return res.status(500).json({message: "Unable to fetch: internal server error", error: selectErr})
    }

    if (oldData.length > 0) {
        const farmCopy: farm = oldData[0]
        const latlng: coordinate = {
            lat: newData.coordinate!.lat,
            long: newData.coordinate!.long
        }
        const { data, error } = await supabase.from("farms").update({
            address: newData.address ?? farmCopy.address,
            coordinate: latlng ?? farmCopy.coordinate,
            land_measurement: newData.land_measurement ?? farmCopy.land_measurement,
            phone_number_1: newData.phone_number_1 ?? farmCopy.phone_number_1,
            phone_number_2: newData.phone_number_2 ?? farmCopy.phone_number_2,
            state: newData.state ?? farmCopy.state,
            lga: newData.lga ?? farmCopy.lga,
            updated_at: new Date
        }).match({id: id})

        if (error) {
            return res.status(400).json(error)
        } else {
            return res.status(200).json(data)
        }        
    } else {
        return res.status(400).json({message: `Farm with id ${id} doesn't exist`})
    }
}
