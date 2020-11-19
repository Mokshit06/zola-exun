import { Flex } from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import Conversation from 'components/Chat/Conversation';
import Sidebar from 'components/Chat/Sidebar';
import useChats from 'contexts/ChatsProvider';
import Head from 'next/head';

function Chat() {
  const { selectedRoom } = useChats();

  return (
    <>
      <Head>
        <title>Chat | Zola</title>
      </Head>
      <Flex flex={1} width='full' overflow='hidden'>
        <Sidebar />
        {selectedRoom && <Conversation />}
      </Flex>
    </>
  );
}

export default Auth(Chat);
