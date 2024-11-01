import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CardWrapper from '@/components/CardWrapper';

const ErrorPage = ({ searchParams }) => {
  const { type } = searchParams;
  const knownErrors = ['invalid_magiclink', 'recovery'];

  return (
    <CardWrapper>
      <h1>Ooops!</h1>
      {type === 'invalid_magiclink' && <strong>The magic link was invalid. Maybe it expired? Please request a new one.</strong>}
      {type === 'recovery' && <strong>Could not request new password. Maybe you had a typo in your E-Mail?</strong>}
      {!knownErrors.includes(type) && <strong>Something went wrong. Please try again or contact support.</strong>}
      <br />
      <br />
      <Button asChild>
        <Link href='/'>Go back</Link>
      </Button>
    </CardWrapper>
  );
};

export default ErrorPage;
