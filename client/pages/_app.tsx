import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Layout from 'components/Layout';
import { ChatsProvider } from 'contexts/ChatsProvider';
import { GlobalProvider } from 'contexts/GlobalProvider';
import { SocketProvider } from 'contexts/SocketProvider';
import { AppProps } from 'next/app';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

const customTheme = extendTheme({ config });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <GlobalProvider>
        <SocketProvider>
          <ChatsProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChatsProvider>
        </SocketProvider>
      </GlobalProvider>
    </ChakraProvider>
  );
}

export default MyApp;
