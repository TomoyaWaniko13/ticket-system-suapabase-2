'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// P.63 Building the login form

const passwordLoginSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'password is required' }),
});

const magicLinkSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
});

type PasswordLoginSchema = z.infer<typeof passwordLoginSchema>;
type MagicLinkSchema = z.infer<typeof magicLinkSchema>;

type Props = {
  isPasswordLogin: boolean;
};

const LoginForm = ({ isPasswordLogin }: Props) => {
  const form = useForm<PasswordLoginSchema | MagicLinkSchema>({
    resolver: zodResolver(isPasswordLogin ? passwordLoginSchema : magicLinkSchema),
    mode: 'onTouched',
    defaultValues: isPasswordLogin ? { email: '', password: '' } : { email: '' },
  });

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const onSubmit = async (values: PasswordLoginSchema | MagicLinkSchema) => {
    try {
      // 認証処理をここに実装
      // 例: await signIn(values.email, values.password);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // デモ用の遅延
      setError('root', { type: 'manual', message: 'Login failed. Please try again.' });
      console.log(values);
    } catch (error) {
      console.error('Login error:', error);
      // エラーハンドリング
      setError('root', { type: 'manual', message: 'Login failed. Please try again.' });
    }
  };

  return (
    <div className={'min-h-screen flex items-center justify-center'}>
      <Card className={'w-full max-w-[480px] p-5'}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-6'>
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
