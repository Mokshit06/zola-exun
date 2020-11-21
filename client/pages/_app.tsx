import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Layout from 'components/Layout';
import { ChatsProvider } from 'contexts/ChatsProvider';
import { GlobalProvider } from 'contexts/GlobalProvider';
import { SocketProvider } from 'contexts/SocketProvider';
import { SpeechProvider } from 'contexts/SpeechProvider';
import { AppProps } from 'next/app';
import Head from 'next/head';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

const customTheme = extendTheme({ config });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <Head>
        <title>Zola</title>
        <meta name='title' content='Zola' />
        <meta
          name='description'
          content="The first all in one platform which you didn't know you needed!"
        />
      </Head>
      <GlobalProvider>
        <SpeechProvider>
          <SocketProvider>
            <ChatsProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChatsProvider>
          </SocketProvider>
        </SpeechProvider>
      </GlobalProvider>
    </ChakraProvider>
  );
}

export default MyApp;
