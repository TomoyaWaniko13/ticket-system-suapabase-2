'use client';

import { startTransition, useActionState, useRef } from 'react';
import { magicLinkLoginAction } from '@/actions/authActions';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { magicLinkSchema, MagicLinkSchema } from '@/lib/schemas/magincLinkLoginSchema';
import CardWrapper from '@/components/CardWrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormError from '@/components/login/FormError';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import LoginButton from '@/components/login/LoginButton';

// https://www.youtube.com/watch?v=VLk45JBe8L8

const MagicLinkForm = () => {
  const [actionState, formAction, isPending] = useActionState(magicLinkLoginAction, { message: '' });
  const formRef = useRef<HTMLFormElement>(null);

  useAuthRedirect();

  const form = useForm<MagicLinkSchema>({
    resolver: zodResolver(magicLinkSchema),
    mode: 'onTouched',
    // actionStateのフィールドがあれば展開。もし、fieldsが未定義だったりnullの場合、空のオブジェクトを使用します。
    defaultValues: { email: '', ...(actionState?.fields ?? {}) },
  });

  const { handleSubmit, control } = form;

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
          <div className={'mt-3 text-primary'}>
            <Link href={{ pathname: '/', query: { magicLink: 'no' } }}>Go to Password Login</Link>
          </div>
          <LoginButton isSubmitting={isPending} label={'Send Magic Link'} loadingLabel={'Sending Magic Link...'} />
        </form>
      </Form>
    </CardWrapper>
  );
};

export default MagicLinkForm;
