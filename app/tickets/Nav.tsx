import Link from 'next/link';
import { Button } from '@/components/ui/button';

// P.69 Creating a shared UI layout with navigation elements

export default function Nav() {
  return (
    <nav className={'flex justify-between'}>
      <ul className={'flex space-x-3'}>
        <li>
          <Button asChild>
            <Link role='button' href='/tickets'>
              Ticket List
            </Link>
          </Button>
        </li>
        <li>
          <Button asChild>
            <Link role='button' href='/tickets/new'>
              Ticket List
            </Link>
          </Button>
        </li>
        <li>
          <Button asChild>
            <Link role='button' href='/tickets/users'>
              User List
            </Link>
          </Button>
        </li>
      </ul>
      <ul>
        <Button asChild variant={'secondary'}>
          <Link role='button' href='/logout'>
            User List
          </Link>
        </Button>
      </ul>
    </nav>
  );
}
