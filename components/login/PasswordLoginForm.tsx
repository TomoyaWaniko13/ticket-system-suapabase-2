'use client';

import { startTransition, useActionState, useRef } from 'react';
import { passwordLoginAction } from '@/actions/authActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordLoginSchema, passwordLoginSchema } from '@/lib/schemas/passwordLoginSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import CardWrapper from '@/components/CardWrapper';
import FormError from '@/components/login/FormError';
import LoginButton from '@/components/login/LoginButton';

// https://www.youtube.com/watch?v=VLk45JBe8L8
const PasswordLoginForm = () => {
  useAuthRedirect();

  const [actionState, formAction, isPending] = useActionState(passwordLoginAction, { message: '' });

  const form = useForm<PasswordLoginSchema>({
    resolver: zodResolver(passwordLoginSchema),
    mode: 'onTouched',
    // actionStateのフィールドがあれば展開。もし、fieldsが未定義だったりnullの場合、空のオブジェクトを使用します。
    defaultValues: { email: '', password: '', ...(actionState?.fields ?? {}) },
  });

  const { handleSubmit, control } = form;

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <CardWrapper>
      <Form {...form}>
        <FormError actionState={actionState} />
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
          <div className={'mt-3 text-primary'}>
            <Link href={{ pathname: '/', query: { magicLink: 'yes' } }}>Go to Magic Link Login</Link>
          </div>
          <LoginButton isSubmitting={isPending} label={'Login'} loadingLabel={'Logging in...'} />
        </form>
      </Form>
    </CardWrapper>
  );
};

export default PasswordLoginForm;
