import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

export const withAuth = (Component: any) => (props: any) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isLoading) return <h1>Loading</h1>;

  if (!isAuthenticated) {
    router.replace('/');
  }

  return <Component {...props} />;
};
