'use client';

import { createSupabaseClient } from '@/supabase-utils/browserClient';
import { useEffect } from 'react';

// P.38 Initializing and testing the base Supabase JavaScript client within Next.js
const HomePage = () => {
  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.storage.listBuckets().then((result) => {
      console.log('Bucket List', result);
    });
  }, []);

  return <div>HomePage</div>;
};

export default HomePage;
