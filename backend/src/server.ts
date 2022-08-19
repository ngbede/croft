import app from "./app"
import { supabaseServer, supabase } from "./db/init";
import { pgInstance } from "./db/pg"
import { params } from "./db/pg-client"

// TODO: Deploy app to digital ocean
app.listen(4000, async () => {
    try {
        await pgInstance.connect()
        .then( _ => {            
            if (supabaseServer && supabase) console.log("Running on port 4000")
            else console.log("client failed to connect")
        })
    } catch (error) {
        throw new Error(`${error}`)
    }
})
