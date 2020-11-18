import { Flex } from '@chakra-ui/react';
import Conversation from 'components/Chat/Conversation';
import Sidebar from 'components/Chat/Sidebar';
import useChats from 'contexts/ChatsProvider';
import Head from 'next/head';

export default function Chat() {
  const { selectedRoom } = useChats();

  return (
    <>
      <Head>
        <title>Chat | Exun</title>
      </Head>
      <Flex flex={1} width='full' overflow='hidden'>
        <Sidebar />
        {selectedRoom && <Conversation />}
      </Flex>
    </>
  );
}
