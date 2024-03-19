import type { Database } from "$lib/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env } from "$env/dynamic/private";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";

let supabase: SupabaseClient<Database> | undefined;

if (env.GOOGLE_API_MODE === "production") {
	supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

export { supabase };
