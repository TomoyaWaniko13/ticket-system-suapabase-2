import { createClient } from "@supabase/supabase-js";

// P.38 Initializing and testing the base Supabase JavaScript client within Next.js
export const createSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
