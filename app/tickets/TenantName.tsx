// P.69 Creating a shared UI layout with navigation elements

type Props = {
  tenantName: string;
};

export default function TenantName({ tenantName }: Props) {
  return (
    <header>
      <div className={'border-l-2 border-l-blue-400 block px-3 py-1 text-xl'}>
        Ticket System
        <strong className={'ml-2'}>{tenantName}</strong>
      </div>
    </header>
  );
}
