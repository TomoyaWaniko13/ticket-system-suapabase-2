'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseCookiesUtilClient } from '@/supabase-utils/cookiesUtilClient';
import { passwordLoginSchema } from '@/lib/schemas/passwordLoginSchema';
import { magicLinkLoginSchema } from '@/lib/schemas/magincLinkLoginSchema';
import { ZodIssue } from 'zod';
import { redirect } from 'next/navigation';
import { ActionResult } from '@/types';

export const passwordLoginAction = async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
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
    return {
      message: 'Invalid form data',
      fields,
      issues: parsed.error.issues.map((issue: ZodIssue) => issue.message),
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { message: 'Your email or password is wrong' };

  revalidatePath('/', 'layout');
  redirect('/tickets');
};

// P.114 Sending magic links with signInWithOtp() on the frontend
export const magicLinkLoginAction = async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
  const supabase = await getSupabaseCookiesUtilClient();

  const formDataEntries = Object.fromEntries(formData);
  const parsed = magicLinkLoginSchema.safeParse(formDataEntries);

  if (!parsed.success) {
    const fields: Record<string, string> = {};

    for (const key of Object.keys(formDataEntries)) {
      // formDataEntries[key] は任意の型（この場合はFormDataEntryValue）かもしれませんが
      // toString()メソッドで確実に文字列に変換しています
      fields[key] = formDataEntries[key].toString();
    }
    return {
      message: 'Invalid form data',
      fields,
      issues: parsed.error.issues.map((issue: ZodIssue) => issue.message),
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: false },
  });

  if (error) return { message: 'Failed to send the magic link email. Please try again later.' };

  revalidatePath('/', 'layout');
  redirect('/magic-thanks');
  return { message: 'success' };
};

// P.107 Logging out using the backend
export const signOutAction = async () => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { error } = await supabase.auth.signOut();
  console.log(error);

  revalidatePath('/', 'layout');
  redirect('/');
};

export const testAction = async () => {
  console.log('this');
};
