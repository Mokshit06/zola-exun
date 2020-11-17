import api from './axios';

export default async function fetcher<Response = any>(url: string) {
  try {
    const { data } = await api.get<Response>(url);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
