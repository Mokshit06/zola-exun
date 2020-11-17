import { GlobalProvider } from 'contexts/GlobalProvider';
import { SocketProvider } from 'contexts/SocketProvider';
import { AppProps } from 'next/app';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <SocketProvider>
        <Header />
        <Component {...pageProps} />
      </SocketProvider>
    </GlobalProvider>
  );
}

export default MyApp;
