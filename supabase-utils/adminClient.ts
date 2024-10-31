import { createClient } from '@supabase/supabase-js';

// P.123 Preparing a Superadmin client
export const getSupabaseAdminClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
};
