import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

console.log(baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
