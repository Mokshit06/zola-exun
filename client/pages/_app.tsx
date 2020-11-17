import { GlobalProvider } from 'contexts/GlobalProvider';
import { SocketProvider } from 'contexts/SocketProvider';
import { ChatsProvider } from 'contexts/ChatsProvider';
import { AppProps } from 'next/app';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <SocketProvider>
        <ChatsProvider>
          <Header />
          <Component {...pageProps} />
        </ChatsProvider>
      </SocketProvider>
    </GlobalProvider>
  );
}

export default MyApp;
