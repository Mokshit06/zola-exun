import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? process.env.NEXT_PUBLIC_API_URL : '';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
