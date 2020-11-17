import { Flex, Heading, Box, Button, FlexProps, Text } from '@chakra-ui/react';
import { useState } from 'react';

const MenuItems: React.FC = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display='block'>
    {children}
  </Text>
);

export default function Header(props: FlexProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='wrap'
      padding='1.3rem'
      boxShadow='md'
      {...props}
    >
      <Flex align='center' mr={5}>
        <Heading as='h1' size='lg' letterSpacing={'-.1rem'}>
          Chakra UI
        </Heading>
      </Flex>

      <Box display={{ base: 'block', md: 'none' }} onClick={handleToggle}>
        <svg
          fill='white'
          width='12px'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
          cursor='pointer'
        >
          <title>Menu</title>
          <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
        </svg>
      </Box>

      <Box
        display={{ sm: isOpen ? 'block' : 'none', md: 'flex' }}
        width={{ sm: 'full', md: 'auto' }}
        alignItems='center'
        flexGrow={1}
      >
        <MenuItems>Docs</MenuItems>
        <MenuItems>Examples</MenuItems>
        <MenuItems>Blog</MenuItems>
      </Box>

      <Box
        display={{ sm: isOpen ? 'block' : 'none', md: 'block' }}
        mt={{ base: 4, md: 0 }}
      >
        <Button bg='transparent' borderWidth={1} borderRadius={4}>
          Create account
        </Button>
      </Box>
    </Flex>
  );
}
