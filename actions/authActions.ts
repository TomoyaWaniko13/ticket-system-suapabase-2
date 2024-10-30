'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseCookiesUtilClient } from '@/supabase-utils/cookiesUtilClient';
import { passwordLoginSchema } from '@/lib/schemas/passwordLoginSchema';
import { magicLinkLoginSchema } from '@/lib/schemas/magincLinkLoginSchema';
import { ZodIssue } from 'zod';
import { redirect } from 'next/navigation';

// P.99 Implementing the login functionality in our app
// https://www.youtube.com/watch?v=VLk45JBe8L8

export type LoginFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function passwordLoginAction(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // Supabase における Auth について:
  // https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app
  const supabase = await getSupabaseCookiesUtilClient();

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

  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });

  if (error) return { message: 'Your email or password is wrong' };

  revalidatePath('/', 'layout');
  redirect('/tickets');
}

export async function magicLinkLoginAction(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const supabase = await getSupabaseCookiesUtilClient();

  const formDataEntries = Object.fromEntries(formData);
  const parsed = magicLinkLoginSchema.safeParse(formData);

  // const { error } = await supabase.auth.signInWithPassword(data);

  // if (error) return { message: 'error' };

  revalidatePath('/', 'layout');
  return { message: 'success' };
}
