import { Flex } from '@chakra-ui/react';
import Sidebar from 'components/Chat/Sidebar';
import Conversation from 'components/Chat/Conversation';
import useChats from 'contexts/ChatsProvider';

export default function Chat() {
  const { selectedRoom } = useChats();

  return (
    <Flex>
      <Sidebar />
      {selectedRoom ? <Conversation /> : <h1>No rooms selected</h1>}
    </Flex>
  );
}
