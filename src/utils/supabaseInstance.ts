import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_SUPABASE_API_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default supabase;