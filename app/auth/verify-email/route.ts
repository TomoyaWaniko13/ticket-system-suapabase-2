import { getSupabaseCookiesUtilClient } from '@/supabase-utils/cookiesUtilClient';
import { NextRequest, NextResponse } from 'next/server';
import { EmailOtpType } from '@supabase/auth-js';

// P.128 Adding the magic link verification route
// https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashed_token = searchParams.get('hashed_token');

  const supabase = await getSupabaseCookiesUtilClient();

  const { error } = await supabase.auth.verifyOtp({ type: 'magiclink' as EmailOtpType, token_hash: hashed_token! });

  if (error) {
    return NextResponse.redirect(new URL('/error?type=invalid_magiclink', request.url));
  } else {
    return NextResponse.redirect(new URL('/tickets', request.url));
  }
}
