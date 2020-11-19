import { Class, Meeting, User, Weather } from 'interfaces';
import fetcher from 'lib/fetcher';
import useSWR, { ConfigInterface } from 'swr';
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

export function useSingleMeeting(id: string, config?: ConfigInterface) {
  const { user } = useAuth();

  return useSWR<Meeting>(
    user && id ? ['/api/meetings', id] : null,
    (url: string, id: string) => fetcher(`${url}/${id}`),
    config
  );
}

export function useMeetings() {
  const { user } = useAuth();

  return useSWR<Meeting[]>(user && '/api/meetings', fetcher);
}

export function useWeather(lat: number, lon: number) {
  return useSWR<Weather>(
    lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : null,
    fetcher
  );
}
