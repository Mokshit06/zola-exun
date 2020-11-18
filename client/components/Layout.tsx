import { Flex } from '@chakra-ui/react';
import Header from './Header';
import { css } from '@emotion/react';

const Layout: React.FC = ({ children }) => {
  return (
    <Flex minH='100vh' flexDirection='column'>
      <Header />
      {children}
    </Flex>
  );
};

export default Layout;
