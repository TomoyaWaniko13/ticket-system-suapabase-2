import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/supabase';

// P.45 Creating a Supabase client based on the request and response for the middleware
// P.55 Using Supabase with TypeScript

/**
 * Next.jsのミドルウェアでSupabaseクライアントを初期化するための型定義
 * リクエストオブジェクトの型安全性を確保
 */
type SupabaseClientProps = { request: NextRequest };

/**
 * リクエストとレスポンスに基づいてSupabaseクライアントを初期化する関数
 *
 * Next.jsのミドルウェアでSupabaseを使用するための特別な設定:
 * - リクエストとレスポンスの両方でクッキーを適切に管理
 * - セッション情報の維持と更新を可能に
 * - ミドルウェアの制約に対応したクッキー処理
 *
 * @param request - Next.jsのリクエストオブジェクト
 * @returns Supabaseクライアントとレスポンスオブジェクトを含むオブジェクト
 */
export const getSupabaseReqResClient = ({ request }: SupabaseClientProps) => {
  // Next.jsの制約に対応するため、valueプロパティを持つオブジェクトとしてレスポンスを作成
  // これにより、Supabaseクライアントによる後続の変更が可能になる
  let response = { value: NextResponse.next({ request: request }) };

  // TypeScriptの型安全性を確保しながらSupabaseクライアントを初期化
  // Database型を使用することで、Supabaseの操作に型の恩恵を受けられる
  const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      // リクエストからすべてのクッキーを取得
      // セッション情報やユーザー認証状態を維持するために必要
      getAll() {
        return request.cookies.getAll();
      },

      // クッキーの処理を3段階で実行し、確実なセッション管理を実現
      setAll(cookiesToSet) {
        // ステップ1: リクエストオブジェクトにクッキーを設定
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
        /*
         * この時点で、リクエストオブジェクトにクッキーが設定された
         * しかし、Next.jsは受け取った変更されていないリクエストオブジェクトのコピーを作成するため
         * このままでは後続の処理(ミドルウェアの処理の後の処理)に伝わらない
         */

        // ステップ2: { request }を渡すことで、修正したリクエストをもとに新しいレスポンスを作成
        response.value = NextResponse.next({ request });
        /*
         * NextResponse.next()に修正したリクエストを渡すことで
         * Next.jsに「このリクエストを使って後続の処理(ミドルウェアの処理の後の処理)を行ってください」
         * と指示している
         * これにより、ページ処理やAPIルートでこのクッキーが利用可能になる
         */

        // ステップ3: ブラウザに返すレスポンスにもクッキーを設定
        cookiesToSet.forEach(({ name, value, options }) => {
          response.value.cookies.set(name, value, options);
        });
        /*
         * これは次回のリクエストのために必要
         * ブラウザがこのクッキーを保存し、次回のリクエストで送信する
         */
      },
    },
  });

  return { supabase, response };
};

// // 1. レストランでの注文の例
//
// // ❌ 間違った方法
// ウェイター「注文を受けました」（元のリクエスト）
// 客「ドリンクも追加で」（クッキーの設定）
// ウェイター「はい、注文通りお作りします」（NextResponse.next()）
// → キッチンには元の注文だけが伝わる（ドリンクの追加が失われる）
//
// // ✅ 正しい方法
// ウェイター「注文を受けました」（元のリクエスト）
// 客「ドリンクも追加で」（クッキーの設定）
// ウェイター「ドリンク追加の注文でお作りします」（NextResponse.next({ request })）
// → キッチンに修正された注文が伝わる
