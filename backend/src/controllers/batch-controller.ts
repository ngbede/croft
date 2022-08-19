import { Request, Response } from "express"
import { supabase } from "../db/init"
import validator from "validator"
import { batchSchema, batch } from "../schema/batch-schema"
import parseErrors from "../utils/parse-validation-errors"
import { pgInstance } from "../db/pg"
import { getBatchQuery } from "../queries/batch-queries"

// refactor UUID validation logic
export const createBatch = async (req: Request, res: Response) => {
    const newBatch: batch = req.body
    const {error: validationError, value} = batchSchema.validate(newBatch, {abortEarly: false})
    const errors = parseErrors(validationError)
    
    if (errors.length > 0) {
        return res.status(422).json({
            message: "validation failed on request body", 
            errors: errors
        })
    }

    const { data, error } = await supabase.from("batch").insert([newBatch])
    
    if (error) {
        return res.status(400).json({message: "Error creating new batch", error: error})
    }

    if (data.length > 0) {
        return res.status(200).json({message: "New batch created", data: data[0]})
    }
}

export const getBatch = async (req: Request, res: Response) => {
    const farmId: string = req.params.id
    const isValidUUID = validator.isUUID(farmId)

    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }

    try {
        const response = await pgInstance.query(getBatchQuery(), [farmId])
        console.log(response)
        if (response.rowCount > 0) {
            return res.status(200).json(response.rows)
        } else {
            return res.status(404).json({message: "No batches found for given farm id"})
        } 
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: "Internal server error: unable to fetch data", error: error})
    }
}

export const deleteBatch =async (req: Request, res: Response) => {
    const batchId: string = req.params.id
    const isValidUUID = validator.isUUID(batchId)

    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }

    const { data, error } = await supabase.from("batch").delete().match({id: batchId})
    
    if (error) {
        return res.status(400).json(error)
    }

    if (data.length > 0) {
        return res.status(200).json({message: `Batch successfully deleted`, data: data[0]})
    } else {
        return res.status(200).json({message: `No batch with id ${batchId} found`})
    }
}

export const updateBatch =async (req: Request, res: Response) => {
    const batchId: string = req.params.id
    const newBatch: batch = req.body
    const isValidUUID = validator.isUUID(batchId)

    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }

    /**
     * Update
     * "name"
     * "active"
     */

    const { data: oldBatch, error } = await supabase.from("batch").select(
        `name,
        active`
    ).match({id: batchId})
    
    if (error) {
        return res.status(500).json({message: "Unable to fetch: internal server error", error: error})
    }

    if (oldBatch.length > 0) {
        const batchCopy: batch = oldBatch[0]
        const { data, error } = await supabase.from("batch").update({
            name: newBatch.name ?? batchCopy.name,
            active: newBatch.active ?? batchCopy.active,
            bird_category: newBatch.bird_category ?? batchCopy.bird_category
        }).match({id: batchId})

        if (error) {
            return res.status(400).json(error)
        } else {
            return res.status(200).json(data)
        }
    } else {
        return res.status(400).json({message: `Batch with id ${batchId} doesn't exist`})
    }
}
