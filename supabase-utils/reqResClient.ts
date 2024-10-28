import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// P.45 Creating a Supabase client based on the request and response for the middleware

type SupabaseClientProps = { request: NextRequest };

export const getSupabaseReqResClient = ({ request }: SupabaseClientProps) => {
  let response = { value: NextResponse.next({ request: request }) };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response.value = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.value.cookies.set(name, value, options);
          });
        },
      },
    },
  );
  return { supabase, response };
};
