'use client';
import { use } from 'react';

import LoginForm from '@/app/LoginForm';

// P.38 Initializing and testing the base Supabase JavaScript client within Next.js
// P.42 Utilizing createBrowserClient on the frontend
// P.63 Building the login form

type Props = {
  searchParams: Promise<{ magicLink: 'yes' | 'no' }>;
};

const HomePage = (props: Props) => {
  const searchParams = use(props.searchParams);
  const wantsMagicLink = searchParams.magicLink === 'yes';

  return <LoginForm isPasswordLogin={!wantsMagicLink} />;
};

export default HomePage;
