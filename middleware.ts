import { getSupabaseReqResClient } from '@/supabase-utils/reqResClient';
import { NextRequest, NextResponse } from 'next/server';

// P.47 Using the request/response client in the middleware
// P.95 Preparing the middleware for authentication
// P.102 Protecting access to the Ticket Management system
/**
 * Next.jsのミドルウェア関数
 * すべてのリクエストに対して実行され、Supabaseの認証セッションを確認します
 *
 * @param request - 受信したHTTPリクエスト
 * @returns 処理済みのレスポンス
 */
export async function middleware(request: NextRequest) {
  // Supabaseクライアントとレスポンスオブジェクトを初期化
  const { supabase, response } = getSupabaseReqResClient({ request });
  // 現在のセッションを取得。これによりクッキーが自動的に更新され、セッションが維持される。
  // セッションが無効な場合は自動的にリフレッシュが試みられる。
  // P.102 に getSession() のセキュリティーについて書かれています。
  const session = await supabase.auth.getSession();

  const requestedPath = request.nextUrl.pathname;
  const sessionUser = session.data?.session?.user;

  if (requestedPath.startsWith('/tickets')) {
    if (!sessionUser) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (requestedPath === '/') {
    if (sessionUser) {
      return NextResponse.redirect(new URL('/tickets', request.url));
    }
  }

  // 更新されたクッキーを含むレスポンスを返す
  return response.value;
}

/**
 * ミドルウェアの実行条件を設定
 *
 * matcher: ['/((?!.*\\.).*)']の説明:
 * - /: ルートから始まるパスにマッチ
 * - (?!.*\\.): 後ろにドット(.)を含まないパスにマッチ
 *   - これにより、静的ファイル（.js, .css, .png等）に対してミドルウェアが実行されるのを防ぐ
 * - .*: その後の任意の文字列にマッチ
 */
export const config = {
  matcher: ['/((?!.*\\.).*)'],
};
