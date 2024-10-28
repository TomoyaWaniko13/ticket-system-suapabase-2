import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/supabase';

// P.38 Initializing and testing the base Supabase JavaScript client within Next.js
// P.42 Utilizing createBrowserClient on the frontend
// P.55 Using Supabase with TypeScript

export const getSupabaseBrowserClient = () =>
  createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
