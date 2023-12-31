import { createClient } from "@supabase/supabase-js";
import { type Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DB_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_DB_KEY;

// console.log(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
