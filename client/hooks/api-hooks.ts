import { User } from 'interfaces';
import fetcher from 'lib/fetcher';
import useSWR from 'swr';

export function useTeachers() {
  return useSWR<User[]>('/api/teachers', fetcher);
}
