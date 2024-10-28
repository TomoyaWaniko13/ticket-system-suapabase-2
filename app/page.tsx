'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/supabase-utils/browserClient';

// P.38 Initializing and testing the base Supabase JavaScript client within Next.js
// P.42 Utilizing createBrowserClient on the frontend
const HomePage = () => {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.storage.listBuckets().then((result) => {
      console.log('Bucket List', result);
    });
  }, []);

  return <div>HomePage</div>;
};

export default HomePage;
