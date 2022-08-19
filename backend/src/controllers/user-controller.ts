import validator from "validator"
import { userSchema, user } from "../schema/user-schema"
import { Request, Response, NextFunction } from "express"
import { supabaseServer } from "../db/init"
import checkAccount from "../utils/account-exist"

export const getUserViaId = async ( req: Request, res: Response, next: NextFunction ) => {
    const id = req.params.id
    const isValidUUID = validator.isUUID(id)
    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }
    const { data: user, error } = await supabaseServer.auth.api.getUserById(id)
    //.from("auth.users").select("*").filter("id", "eq", id)
    if (error) {
        error.message = `user with id ${id} doesn't exist`
        return res.status(error.status).json(error)
    } else {
        const { id, email, user_metadata, created_at, updated_at } = user
        return res.status(200).json({ 
            id: id, 
            email: email, 
            user_data: user_metadata, 
            created_at: created_at, 
            updated_at: updated_at 
        })
    }
}

export const createUser = async (req: Request, res: Response) => {
    const { error: validationError, value } = userSchema.validate(req.body, {abortEarly: false})
    if (validationError) {
        const errors = validationError.details.map( errs => {
            return errs.message.replace('\"', "").replace("\"", "")
        })
        
        return res.status(422).json({
            message: "validation failed on request body", 
            errors: errors
        })
    }

    const newUser: user = value
    const { user, error } = await supabaseServer.auth.api
    .createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            phone_number: newUser.phone_number,
            phone_number2: newUser.phone_number2,
            date_of_birth: newUser.date_of_birth
        }
    })

    if (error) return res.status(error.status).json(error)
    if (user) {
        // send a verification link to email
        const { data, error } = await supabaseServer.auth.api.sendMagicLinkEmail(
            newUser.email, 
            {shouldCreateUser: false
        })
        return res.status(200).json({
            id: user.id,
            email: user.email,
            user_data: user.user_metadata,
            verification_sent: data !== null,
            created_at: user.created_at,
            updated_at: user.updated_at
        })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const isEmail = validator.isEmail(req.body.email || '')
    let validUser
    if (!isEmail){
        return res.status(422).json({message: "Invalid email sent"})
    }

    const { data: userList, error: userErrors} = await supabaseServer.auth.api.listUsers()
    if (userList) {
        // check if user is amongst list of users
        validUser = userList.map(u => u.email).includes(req.body.email)
    }
    
    if (validUser){
        const { data, error } = await supabaseServer.auth.api.generateLink('recovery', "ogasule001@gmail.com")
        if (data){
            // TODO: reduce data sent
            return res.status(200).json(data)
        } else {
            return res.status(500).json({
                message: "Internal server error, unable to send reset link",
                error: error
            })
        }
    } else return res.status(404).json({message: "account doesn't exist"})
}

export const signIn = async (req: Request, res: Response) => {
    const info: user = req.body
    const validEmail = validator.isEmail(info.email || '')
    if (!validEmail) {
        return res.status(422).json({message: "Invalid email sent"})
    } if (typeof (info.password) !== 'string') {
        return res.status(422).json({message: "password is a required field"})
    }

    const emailExist = await checkAccount(info.email)
    
    if (!emailExist) {
        return res.status(404).json({message: "account doesn't exist"})
    }
    const {data, error} = await supabaseServer.auth.api.signInWithEmail(info.email, info.password)
    
    if (data) {
        return res.status(200).json(data)
    }
    if (error) {
        error.message = "Invalid password"
        return res.status(error.status).json(error)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id
    const isValidUUID = validator.isUUID(id)
    
    if (!isValidUUID) {
        return res.status(404).json({message: "Invalid uuid sent"})
    }
    const { data, error } = await supabaseServer.auth.api.deleteUser(id)
    
    if (error) {
        return res.status(error.status).json(error)
    }
    return res.status(200).json({
        message: `User with id ${id} has been deleted successfully`
    })
}
