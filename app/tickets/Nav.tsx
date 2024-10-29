'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

// P.69 Creating a shared UI layout with navigation elements
// P.75 Constructing the Ticket Details page
// P.86 Enhancing the navigation component

const links = [
  { label: 'Ticket List', href: '/tickets' },
  { label: 'Create new Ticket', href: '/tickets/new' },
  { label: 'Ticket List', href: '/tickets/users' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={'flex justify-between'}>
      <ul className={'flex space-x-3'}>
        {links.map((link) => (
          <li>
            <Button asChild variant={pathname === link.href ? 'default' : 'outline'}>
              <Link role={'button'} href={link.href}>
                {link.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
      <ul>
        <Button asChild variant={'secondary'}>
          <Link role='button' href='/logout'>
            Log out
          </Link>
        </Button>
      </ul>
    </nav>
  );
}
