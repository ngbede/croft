import { createClient } from "@supabase/supabase-js"
require('dotenv/config')

export const supabase = createClient(process.env.url!, process.env.anon_key!)

// use for auth related stuff master key with elevated priviledges
export const supabaseServer = createClient(process.env.url!, process.env.service_role!)
