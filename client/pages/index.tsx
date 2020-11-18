import { Button, Heading } from '@chakra-ui/react';
import useSocket from 'contexts/SocketProvider';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const socket = useSocket();

  useEffect(() => {
    console.log(socket);
  }, [socket]);

  return <Heading>Home</Heading>;
}
