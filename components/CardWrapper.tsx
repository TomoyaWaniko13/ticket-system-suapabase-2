import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

const CardWrapper = ({ children }: Props) => {
  return (
    <div className={'min-h-screen flex items-center justify-center px-10'}>
      <Card className={'w-full max-w-[600px] p-5'}>{children}</Card>
    </div>
  );
};

export default CardWrapper;
