import { useToast } from '@chakra-ui/react';
import { User } from 'interfaces';
import Router from 'next/router';
import useSWR from 'swr';
import api from '../lib/axios';
import fetcher from '../lib/fetcher';

export default function useAuth() {
  const { data, error, mutate } = useSWR<User>('/auth/me', fetcher);
  const toast = useToast();

  const login = (provider: string) => {
    if (typeof window !== 'undefined') {
      const consentURL = `${
        process.env.NEXT_PUBLIC_API_URL || ''
      }/auth/${provider}`;

      window.open(consentURL, '__blank', 'width=500&height=800');
      window.addEventListener('message', async event => {
        if (event.data === 'success') {
          await mutate();
          await Router.push('/');
          toast({
            title: 'Logged In!',
            description: `You are logged in to your account!`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      });
    }
  };

  const logout = async () => {
    try {
      await Router.push('/');
      await api.post('/auth/logout');
      mutate(null, false);
      toast({
        title: 'Logged Out!',
        description: `You are logged out of your account!`,
        status: 'success',
        isClosable: true,
        duration: 3000,
      });
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
