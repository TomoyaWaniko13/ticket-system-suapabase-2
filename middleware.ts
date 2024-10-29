import { getSupabaseReqResClient } from '@/supabase-utils/reqResClient';
import { NextRequest } from 'next/server';

// P.47 Using the request/response client in the middleware
// P.95 Preparing the middleware for authentication
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
  await supabase.auth.getSession();

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
