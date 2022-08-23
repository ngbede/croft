import app from "./app"
import { supabaseServer, supabase } from "./db/init";
import { pgInstance } from "./db/pg"
require('dotenv/config')

app.listen(process.env.port, async () => {
    try {
        await pgInstance.connect()
        .then( _ => {            
            if (supabaseServer && supabase) console.log(`Running on port ${process.env.port}`)
            else console.log("client failed to connect")
        })
    } catch (error) {
        throw new Error(`${error}`)
    }
})
