import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

export default function Loader() {
  return (
    <Flex flex={1} width='fill' alignItems='center' justifyContent='center'>
      <Spinner size='xl' />
    </Flex>
  );
}
