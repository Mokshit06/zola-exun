import { Flex } from '@chakra-ui/react';
import Sidebar from 'components/Chat/Sidebar';
import Conversation from 'components/Chat/Conversation';
import useChats from 'contexts/ChatsProvider';

export default function Chat() {
  const { selectedRoom } = useChats();

  return (
    <Flex flex={1} width='full'>
      <Sidebar />
      {selectedRoom && <Conversation />}
    </Flex>
  );
}
