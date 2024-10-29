'use client';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';

// P.83 Implementing a page to create a new ticket

const ticketSchema = z.object({
  title: z.string().min(3, { message: 'title must be at least 3 characters' }),
  comment: z.string().min(3, { message: 'comment must be at least 3 characters' }),
});

type TicketSchema = z.infer<typeof ticketSchema>;

export default function CreateTicket() {
  const form = useForm<TicketSchema>({
    resolver: zodResolver(ticketSchema),
    mode: 'onTouched',
    defaultValues: { title: '', comment: '' },
  });

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const onSubmit = async (data: TicketSchema) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // デモ用の遅延
      console.log(data);
    } catch (error) {
      console.log(error);
      setError('root', { type: 'manual', message: 'Ticket creation failed. Please try again.' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-2xl'>
        <h3 className={'text-xl font-bold'}>Create a new ticket</h3>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Add a title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder='Add a comment' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* errors.root は React Hook Form の setError 関数を使って設定される特別なエラーです。 */}
        {errors.root && <div className='text-sm text-red-500'>{errors.root.message}</div>}
        <Button disabled={isSubmitting} className='w-full'>
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Submitting
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
}
