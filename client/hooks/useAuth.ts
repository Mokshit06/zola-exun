import api from '../lib/axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { User } from 'interfaces';

export default function useAuth() {
  const { data, error, mutate } = useSWR<User>('/auth/me', fetcher);
  const router = useRouter();

  const login = (provider: string) => {
    if (typeof window !== 'undefined') {
      const consentURL = `${
        process.env.NEXT_PUBLIC_API_URL || ''
      }/auth/${provider}`;

      window.open(consentURL, '__blank', 'width=500&height=800');
      window.addEventListener('message', event => {
        console.log(event.data);
        if (event.data === 'success') {
          mutate();
          router.push('/');
        }
      });
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      router.replace('/');
      mutate(null, false);
      mutate();
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  return {
    isAuthenticated: !error && !!data,
    user: data,
    login,
    error,
    logout,
    loading: !error && !data,
  };
}
