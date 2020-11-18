import { AxiosRequestConfig } from 'axios';
import api from './axios';

interface ApiResponse {
  success?: boolean;
  message?: string;
}

export default async function fetcher<Response = any>(
  url: string,
  config?: AxiosRequestConfig
) {
  try {
    const { data } = await api.get<Response & ApiResponse>(url, config);

    if (data.success === false) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error);
  }
}
