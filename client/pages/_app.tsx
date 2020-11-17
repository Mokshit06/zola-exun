import { AppProps } from 'next/app';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import Header from '../components/Header';
import '../styles/globals.css';

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Header />
      <Component {...pageProps} />
    </ReactQueryCacheProvider>
  );
}

export default MyApp;
