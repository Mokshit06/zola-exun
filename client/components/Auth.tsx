import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

export const Auth = (Component: any) => (props: any) => {
  const { loading } = useAuth();
  // const router = useRouter();

  if (loading) return <h1>Loading</h1>;

  // if ((guest && isAuthenticated) || (!guest && !isAuthenticated)) {
  //   router.replace('/');
  // }

  return <Component {...props} />;
};
