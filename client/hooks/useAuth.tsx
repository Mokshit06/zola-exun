import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { User } from '../interfaces';
import api from '../lib/axios';
import fetcher from '../lib/fetcher';

export default function useAuth() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const { data, error, isLoading, isError } = useQuery<
    User,
    { message: string }
  >('user', () => fetcher<User>('/auth/me'), { retry: false });

  const [mutate] = useMutation(() => fetcher<User>('/auth/me'), {
    onSuccess: () => {
      queryCache.invalidateQueries('user');
    },
  });

  const [logoutMutate] = useMutation(() => api.post('/auth/logout'), {
    onSuccess: () => {
      queryCache.setQueryData('user', null);
      queryCache.invalidateQueries('user');
    },
  });

  const login = () => {
    if (typeof window !== 'undefined') {
      const consentURL = `${process.env.NEXT_PUBLIC_API_URL || ''}/auth/login`;

      window.open(consentURL, '__blank', 'width=500&height=800');
      window.addEventListener('message', async event => {
        if (event.data === 'success') {
          await mutate();
        }
      });
    }
  };

  const logout = async () => {
    try {
      await logoutMutate();
      router.replace('/');
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  return {
    isAuthenticated: !!(!isLoading && !error && data),
    user: data,
    login,
    logout,
    error: isError && error.message,
    isLoading,
  };
}
