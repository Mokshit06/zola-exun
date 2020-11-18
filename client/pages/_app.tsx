import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import Layout from 'components/Layout';
import { ChatsProvider } from 'contexts/ChatsProvider';
import { GlobalProvider } from 'contexts/GlobalProvider';
import { SocketProvider } from 'contexts/SocketProvider';
import { AppProps } from 'next/app';
// import 'focus-visible/dist/focus-visible';

const GlobalStyles = css`
  /* .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  } */
`;

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

const customTheme = extendTheme({ config });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <Global styles={GlobalStyles} />
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
