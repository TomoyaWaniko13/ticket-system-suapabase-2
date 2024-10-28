import { getSupabaseReqResClient } from "@/supabase-utils/reqResClient";
import { NextRequest } from "next/server";

// P.47 Using the request/response client in the middleware
export async function middleware(request: NextRequest) {
  const { supabase, response } = getSupabaseReqResClient({ request });
  return response.value;
}
