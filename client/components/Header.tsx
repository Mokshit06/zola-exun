import {
  Box,
  Button,
  Flex,
  FlexProps,
  Heading,
  IconButton,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import { FaBars, FaTimes } from 'react-icons/fa';
import { NextChakraLink } from './Link';

const MenuItem: React.FC<{ href: string }> = ({ children, href }) => (
  <NextChakraLink href={href} mx={[0, 4, 6]} display='block'>
    {children}
  </NextChakraLink>
);

export default function Header(props: FlexProps) {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthenticated, logout } = useAuth();

  return (
    <Flex
      as='nav'
      align='center'
      wrap='wrap'
      padding='1.3rem'
      zIndex={1000}
      boxShadow='md'
      {...props}
    >
      <Flex align='center' mr={5}>
        <Heading as='h1' size='lg' letterSpacing={'-.1rem'}>
          Prisma
        </Heading>
      </Flex>

      <Spacer />

      <Box display={{ base: 'block', md: 'none' }} onClick={onToggle}>
        <IconButton
          aria-label='Menu Icon'
          icon={isOpen ? <FaTimes /> : <FaBars />}
        />
      </Box>

      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
        width={{ md: 'auto', base: 'full' }}
        alignItems='center'
      >
        <MenuItem href='/'>Home</MenuItem>
        {isAuthenticated ? (
          <>
            <MenuItem href='/dashboard'>Dashboard</MenuItem>
            <MenuItem href='/chat'>Chat</MenuItem>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <MenuItem href='/login'>Login</MenuItem>
        )}
      </Box>
    </Flex>
  );
}
