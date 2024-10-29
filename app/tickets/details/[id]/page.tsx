import TicketComments from '@/app/tickets/details/[id]/TicketComments';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// P.75 Constructing the Ticket Details page
// P.78 Adding the comments section to the ticket details

type Props = {
  params: { id: string };
};

const TicketDetailsPage = ({ params }: Props) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>#{params.id} - Open</CardTitle>
          <CardDescription>
            Created by <strong>AuthorName</strong> at <time>December 10th 2025</time>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className={'text-2xl font-bold'}>Ticket title should be here</h2>
          <section>Some details about the ticket should be here.</section>
        </CardContent>
        <CardFooter>
          <TicketComments />
        </CardFooter>
      </Card>
    </>
  );
};

export default TicketDetailsPage;
