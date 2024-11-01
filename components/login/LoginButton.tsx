import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  isSubmitting: boolean;
  label: string;
  loadingLabel: string;
};

const LoginButton = ({ isSubmitting, label, loadingLabel }: Props) => {
  return (
    <Button disabled={isSubmitting} className='w-full'>
      {isSubmitting ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default LoginButton;
