'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { magicLinkLoginAction, passwordLoginAction } from '@/actions/authActions';
import { startTransition, useActionState, useEffect, useRef } from 'react';
import { PasswordLoginSchema, passwordLoginSchema } from '@/lib/schemas/passwordLoginSchema';
import { MagicLinkSchema, magicLinkSchema } from '@/app/MagicLinkSchema';
import { getSupabaseBrowserClient } from '@/supabase-utils/browserClient';
import { useRouter } from 'next/navigation';

// P.63 Building the login form
// P.114 Sending magic links with signInWithOtp() on the frontend

type LoginSchema = PasswordLoginSchema | MagicLinkSchema;

type Props = {
  isPasswordLogin: boolean;
};

const LoginForm = ({ isPasswordLogin }: Props) => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  // https://www.youtube.com/watch?v=VLk45JBe8L8
  const [actionState, formAction] = useActionState(isPasswordLogin ? passwordLoginAction : magicLinkLoginAction, { message: '' });

  const form = useForm<LoginSchema>({
    resolver: zodResolver(isPasswordLogin ? passwordLoginSchema : magicLinkSchema),
    mode: 'onTouched',
    defaultValues: isPasswordLogin
      ? // actionStateのフィールドがあれば展開。もし、fieldsが未定義だったりnullの場合、空のオブジェクトを使用します。
        { email: '', password: '', ...(actionState?.fields ?? {}) }
      : { email: '', ...(actionState?.fields ?? {}) },
  });

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // 分割代入（Destructuring assignment） を使用しています。
    // onAuthStateChange() について:
    // https://supabase.com/docs/reference/javascript/auth-onauthstatechange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/tickets');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={'min-h-screen flex items-center justify-center'}>
      <Card className={'w-full max-w-[480px] p-5'}>
        <Form {...form}>
          {actionState?.message !== '' && !actionState.issues && <div className='text-red-500'>{actionState.message}</div>}
          {actionState?.issues && (
            <div className='text-red-500'>
              <ul>
                {actionState.issues.map((issue) => (
                  <li key={issue} className='flex gap-1'>
                    <X fill='red' />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form
            ref={formRef}
            className='space-y-8'
            action={formAction}
            onSubmit={(event) => {
              // ブラウザのデフォルトのフォーム送信を停止
              event.preventDefault();
              // フォームのバリデーションを実行。バリデーションが成功した場合のみ、この中の処理が実行される
              // 最後の (event) により、handleSubmit()が返した関数を実行します。
              handleSubmit(() => {
                // startTransitionは「ちょっと待って、これから重い処理をするよ」とReactに教えるための仕組み
                // これにより、Server Actionの実行中もUIが固まらず、ユーザーは他の操作ができる
                // フォームの送信処理を安全に行える環境を作る
                startTransition(() => {
                  // フォームデータを作成してServer Actionに送信
                  formAction(new FormData(formRef.current!));
                });
              })(event);
            }}
          >
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>emails</FormLabel>
                  <FormControl>
                    <Input type={'email'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPasswordLogin && (
              <FormField
                control={control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type={'password'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className={'mt-3 text-primary'}>
              {isPasswordLogin ? (
                <Link href={{ pathname: '/', query: { magicLink: 'yes' } }}>Go to Magic Link Login</Link>
              ) : (
                <Link href={{ pathname: '/', query: { magicLink: 'no' } }}>Go to Password Login</Link>
              )}
            </div>

            {/* errors.root は React Hook Form の setError 関数を使って設定される特別なエラーです。 */}
            {errors.root && <div className='text-sm text-red-500'>{errors.root.message}</div>}

            <Button disabled={isSubmitting} className='w-full'>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
