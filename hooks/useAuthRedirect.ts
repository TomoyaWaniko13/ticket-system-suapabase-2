import { getSupabaseBrowserClient } from '@/supabase-utils/browserClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuthRedirect = () => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    // 分割代入（Destructuring assignment） を使用しています。
    // onAuthStateChange() について:
    // https://supabase.com/docs/reference/javascript/auth-onauthstatechange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/tickets');
      }
    });

    return () => subscription.unsubscribe();
  }, []);
};
