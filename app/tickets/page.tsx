import { TicketList } from '@/app/tickets/TicketList';

// P.72 Designing the Ticket List page

export interface Ticket {
  id: number;
  title: string;
  status: 'Not started' | 'In progress' | 'Done';
  author: string;
}

const dummyTickets: Ticket[] = [
  {
    id: 1,
    title: 'Write Supabase Book',
    status: 'Not started',
    author: 'Chayan',
  },
  {
    id: 2,
    title: 'Read more Packt Books',
    status: 'In progress',
    author: 'David',
  },
  {
    id: 3,
    title: 'Make videos for the YouTube Channel',
    status: 'Done',
    author: 'David',
  },
];

export default function TicketListPage() {
  return (
    <>
      <h2 className={'font-bold text-2xl'}>Ticket List</h2>
      <TicketList tickets={dummyTickets} />
    </>
  );
}
