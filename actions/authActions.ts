'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseCookiesUtilClient } from '@/supabase-utils/cookiesUtilClient';
import { passwordLoginSchema } from '@/lib/schemas/passwordLoginSchema';
import { magicLinkSchema } from '@/lib/schemas/magincLinkLoginSchema';
import { ZodIssue } from 'zod';
import { redirect } from 'next/navigation';
import { ActionResult } from '@/types';
import { getSupabaseAdminClient } from '@/supabase-utils/adminClient';
import { headers } from 'next/headers';
import { sendVerificationEmail } from '@/lib/mail';

export const passwordLoginAction = async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
  // { email: 'list@gmail.com', password: 'fafa' }
  const formDataEntries = Object.fromEntries(formData);

  // {
  //   success: true,
  //   data: { email: 'lisa@gmail.com', password: 'fafa' }
  // }
  const parsed = passwordLoginSchema.safeParse(formDataEntries);

  if (!parsed.success) {
    const fields: Record<string, string> = {};

    for (const key of Object.keys(formDataEntries)) {
      // formDataEntries[key] は任意の型（この場合はFormDataEntryValue）かもしれませんが
      // toString()メソッドで確実に文字列に変換しています
      fields[key] = formDataEntries[key].toString();
    }
    return { message: 'Invalid form data', fields, issues: parsed.error.issues.map((issue: ZodIssue) => issue.message) };
  }

  // Supabase における Auth について:
  // https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app
  const supabase = await getSupabaseCookiesUtilClient();

  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { message: 'Your email or password is wrong' };

  revalidatePath('/', 'layout');
  redirect('/tickets');
};

// P.114 Sending magic links with signInWithOtp() on the frontend
// P.125 Requesting an OTP from the Auth Service
// P.126 Crafting a link containing the OTP, Sending the crafted link with a custom-made email
export const magicLinkLoginAction = async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
  const formDataEntries = Object.fromEntries(formData);
  const parsed = magicLinkSchema.safeParse(formDataEntries);

  if (!parsed.success) {
    const fields: Record<string, string> = {};

    for (const key of Object.keys(formDataEntries)) {
      // formDataEntries[key] は任意の型（この場合はFormDataEntryValue）かもしれませんが
      // toString()メソッドで確実に文字列に変換しています
      fields[key] = formDataEntries[key].toString();
    }
    return { message: 'Invalid form data', fields, issues: parsed.error.issues.map((issue: ZodIssue) => issue.message) };
  }

  const supabaseAdmin = getSupabaseAdminClient();

  const email = parsed.data.email;

  const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({ email, type: 'magiclink' });

  if (error) return { message: 'Failed to send the magic link email. Please try again later.' };

  const { hashed_token } = linkData.properties;

  /* Get current domain and protocol from headers */
  // headers()は Next.js が提供する関数で、現在のリクエストのHTTPヘッダーにアクセスできます。Server Components や Server Actions 内でのみ使用可能です。
  const headersList = await headers();
  // Host ヘッダーを取得します。これは以下のような値になります：
  // ローカル開発時: localhost:3000、本番環境: example.com、ステージング環境: staging.example.com
  const host: string | null = headersList.get('host');
  // X-Forwarded-Proto ヘッダーを取得し、なければ 'http' をデフォルト値として使用します。
  // X-Forwarded-Proto は、リバースプロキシ（Nginx など）やロードバランサーが、元のリクエストで使用されたプロトコル（http or https）を転送するために使用するヘッダーです
  // 本番環境では通常 'https' になります。ローカル開発時は通常設定されていないので、デフォルト値の 'http' が使用されます。
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;

  // 本番環境では Nodemailer の代わりに Resend を使用します。
  await sendVerificationEmail(email, hashed_token, baseUrl);

  // ローカル環境では Resend の代わりに Nodemailer を使用します。
  // const constructedLink = new URL(`/auth/verify-email?hashed_token=${hashed_token}`, baseUrl);
  // const transporter = createTransport({
  //   host: 'localhost',
  //   port: 54325,
  // });
  //
  // await transporter.sendMail({
  //   from: 'Your Company <your@mail.whatever>',
  //   to: email,
  //   subject: 'Magic Link',
  //   html: `
  //       <h1>Hi there, this is a custom magic link email!</h1>
  //       <p>Click <a href="${constructedLink.toString()}">here</a> to login.</p>
  //         `,
  // });

  revalidatePath('/', 'layout');
  redirect('/magic-thanks');
};

// P.107 Logging out using the backend
export const signOutAction = async () => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { error } = await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/');
};
