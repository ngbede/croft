"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseServer = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
require('dotenv/config');
exports.supabase = (0, supabase_js_1.createClient)(process.env.url, process.env.anon_key);
// use for auth related stuff
exports.supabaseServer = (0, supabase_js_1.createClient)(process.env.url, process.env.service_role);
