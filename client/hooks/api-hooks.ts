import { Class, User } from 'interfaces';
import fetcher from 'lib/fetcher';
import useSWR from 'swr';
import useAuth from './useAuth';

export function useChatSelectOptions() {
  const { user } = useAuth();

  return useSWR<User[]>(
    user?.isTeacher ? '/api/students' : '/api/teachers',
    fetcher
  );
}

export function useClass() {
  const { user } = useAuth();

  return useSWR<Class>(user && '/api/class', fetcher);
}
