import { supabaseServer } from "../db/init"

const checkAccount = async ( email: string ): Promise<boolean> => {
    let validUser = false
    const { data: userList, error: userErrors} = await supabaseServer.auth.api.listUsers()
    if (userList) {
        // check if user is amongst list of users
        validUser = userList.map(u => u.email).includes(email)
    } if (userErrors) {
        throw new Error(userErrors.message)
    }
    return validUser
}

export default checkAccount