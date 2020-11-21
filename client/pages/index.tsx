import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaRocket } from 'react-icons/fa';
import NextImage from 'next/image';
import { css } from '@emotion/react';

export default function Home() {
  const router = useRouter();
  const { colorMode } = useColorMode();
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
      justifyContent='center'
      alignItems='center'
      position='relative'
      overflow='hidden'
    >
      <Head>
        <title>Home | Zola</title>
      </Head>
      <Image
        src={`/assets/triangle-${colorMode}.svg`}
        alt=''
        position='absolute'
        width='40%'
        top={0}
        right={0}
        zIndex={-1}
      />
      <SimpleGrid
        width={{ base: '85%', sm: '80%' }}
        mx='auto'
        height='full'
        alignContent='center'
        gap={4}
        columns={{ base: 1, sm: 1, md: 2 }}
      >
        <Flex
          height='full'
          width='90%'
          flexDir='column'
          justifyContent='center'
        >
          <Heading fontSize='3rem'>Zola</Heading>
          <Text fontSize='1.6rem' mt={6}>
            The first all in one platform which you didn't know you needed!
          </Text>
          <Button
            rightIcon={<FaRocket size='0.9rem' />}
            href='/dashboard'
            size='lg'
            width='fit-content'
            mt={6}
            onClick={getStarted}
          >
            Get Started
          </Button>
        </Flex>
        <Box height='full' width='full'>
          <NextImage
            alt=''
            src='/assets/3784896.png'
            width={800}
            height={500}
            css={css`
              object-fit: contain;
            `}
          />
        </Box>
      </SimpleGrid>
    </Flex>
  );
}
