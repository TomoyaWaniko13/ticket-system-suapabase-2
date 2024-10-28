import { Separator } from '@/components/ui/separator';
import Nav from '@/app/tickets/Nav';
import TenantName from '@/app/tickets/TenantName';

// P.69 Creating a shared UI layout with navigation elements

const TicketsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <section className={'p-12 flex flex-col gap-y-4'}>
      <TenantName tenantName='Packt' />
      <Nav />
      <Separator />
      <section>{children}</section>
    </section>
  );
};

export default TicketsLayout;
