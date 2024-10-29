import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ticket } from '@/app/tickets/page';
import Link from 'next/link';

// P.72 Designing the Ticket List page

interface Props {
  tickets: Ticket[];
}

export function TicketList({ tickets }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead></TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.id}</TableCell>
            <TableCell>
              <Link href={`/tickets/details/${ticket.id}`}>{ticket.title}</Link>
            </TableCell>
            <TableCell>{ticket.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
