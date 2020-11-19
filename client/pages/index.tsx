import { Box, Button, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaRocket } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const getStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <Flex
      flex={1}
      width={{ base: '85%', sm: '80%' }}
      mx='auto'
      justifyContent='center'
      alignItems='center'
    >
      <Head>
        <title>Home | Prisma</title>
      </Head>
      <SimpleGrid
        width='full'
        height='full'
        gap={4}
        columns={{ base: 1, sm: 1, md: 2 }}
      >
        <Box height='full' width='full'>
          <Heading fontSize='3rem'>Prisma</Heading>
          <Text fontSize='1.6rem' mt={6}>
            The first all in one platform which you didn't know you needed!
          </Text>
          <Button
            rightIcon={<FaRocket size='0.9rem' />}
            href='/dashboard'
            size='lg'
            mt={6}
            onClick={getStarted}
          >
            Get Started
          </Button>
        </Box>
        <Box height='full' width='full' />
      </SimpleGrid>
    </Flex>
  );
}
