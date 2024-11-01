import MagicLinkForm from '@/components/login/MagicLinkForm';
import PasswordLoginForm from '@/components/login/PasswordLoginForm';

// P.38 Initializing and testing the base Supabase JavaScript client within Next.js
// P.42 Utilizing createBrowserClient on the frontend
// P.63 Building the login form

// Dynamic APIs are Asynchronous:
// https://nextjs.org/docs/messages/sync-dynamic-apis

const HomePage = async ({ searchParams }: { searchParams: { magicLink: string } }) => {
  const { magicLink } = await searchParams;
  const isMagicLink = magicLink === 'yes';

  return isMagicLink ? <MagicLinkForm /> : <PasswordLoginForm />;
};

export default HomePage;
