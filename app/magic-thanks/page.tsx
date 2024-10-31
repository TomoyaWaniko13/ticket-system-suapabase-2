import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
// P.114 Sending magic links with signInWithOtp() on the frontend

const MagicLinkSuccessPage = () => {
  return (
    <div className={'min-h-screen flex items-center justify-center'}>
      <Card className={'w-full max-w-[500px]'}>
        <CardHeader>
          <CardTitle className={'text-3xl'}>Magic on its way!</CardTitle>
        </CardHeader>
        <CardContent className={'text-xl'}>
          <p>Thanks! You should get a link to login in a few seconds.</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href='/'>Go back</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MagicLinkSuccessPage;
