'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// P.78 Adding the comments section to the ticket details

const comments = [
  {
    author: 'Dave',
    date: '2027-01-01',
    content: 'This is a comment from Dave',
  },
  {
    author: 'Alice',
    date: '2027-01-02',
    content: 'This is a comment from Alice',
  },
];

const commentSchema = z.object({
  comment: z.string().min(3, { message: 'comment must be at least 3 characters' }),
});

type CommentSchema = z.infer<typeof commentSchema>;

const TicketComments = () => {
  const form = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    mode: 'onTouched',
    defaultValues: { comment: '' },
  });

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const onSubmit = async (data: CommentSchema) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // デモ用の遅延
      console.log(data);
    } catch (error) {
      console.log(error);
      setError('root', { type: 'manual', message: 'Comment creation failed. Please try again.' });
    }
  };

  return (
    <footer className={'w-full'}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='comment'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
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
      <section className={'mt-3 space-y-3'}>
        {comments.map((comment, index) => (
          <Card className={'p-3'} key={index}>
            <article key={comment.date}>
              <strong>{comment.author}</strong>
              <time>{comment.date}</time>
              <p>{comment.content}</p>
            </article>
          </Card>
        ))}
      </section>
    </footer>
  );
};

export default TicketComments;
