'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/supabase-utils/browserClient';
import { useEffect } from 'react';

// P.69 Creating a shared UI layout with navigation elements
// P.75 Constructing the Ticket Details page
// P.86 Enhancing the navigation component
// P.104 Logging out using the frontend

const links = [
  { label: 'Ticket List', href: '/tickets' },
  { label: 'Create new Ticket', href: '/tickets/new' },
  { label: 'User List', href: '/tickets/users' },
];

export default function Nav() {
  const pathname = usePathname();
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    // 分割代入（Destructuring assignment） を使用しています。
    // onAuthStateChange() について:
    // https://supabase.com/docs/reference/javascript/auth-onauthstatechange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className={'flex justify-between'}>
      <ul className={'flex space-x-3'}>
        {links.map((link) => (
          <li key={link.label}>
            <Button asChild variant={pathname === link.href ? 'default' : 'outline'}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
      <ul>
        <Button asChild variant={'secondary'}>
          <Link
            href='/logout'
            prefetch={false}
            onClick={(event) => {
              event.preventDefault();
              supabase.auth.signOut();
            }}
          >
            Log out
          </Link>
        </Button>
      </ul>
    </nav>
  );
}
