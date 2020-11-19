import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';

interface AuthOptions {
  guest?: boolean;
  isTeacher?: boolean;
  isStudent?: boolean;
}

const defaultOptions: AuthOptions = {
  guest: false,
  isTeacher: false,
  isStudent: false,
};

export const Auth = (
  Component: any,
  { guest, isTeacher, isStudent }: AuthOptions = defaultOptions
) => (props: any) => {
  const { loading, isAuthenticated, error, user } = useAuth();
  const router = useRouter();

  if (loading) return <Loader />;

  if (
    (guest && isAuthenticated) ||
    (!guest && !isAuthenticated) ||
    (!guest && error) ||
    (!guest && isTeacher && !user?.isTeacher) ||
    (!guest && isStudent && (user?.isAdmin || user?.isTeacher))
  ) {
    router.push('/');
    return null;
  }

  return <Component {...props} />;
};
