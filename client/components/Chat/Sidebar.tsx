import {
  Avatar,
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import useChats from 'contexts/ChatsProvider';
import useAuth from 'hooks/useAuth';
import { Room } from 'interfaces';
import ChatModal from './Modal';

export default function Sidebar() {
  const { rooms } = useChats();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex minW='300px' boxShadow='lg' flexDir='column'>
      {rooms.map((room, index) => (
        <SidebarItem room={room} index={index} key={room.id} />
      ))}
      <Spacer />
      <Box my={3} mx={3}>
        <Button width='full' size='lg' onClick={onOpen}>
          Create Room
        </Button>
      </Box>
      <ChatModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

interface SidebarItemProps {
  room: Room;
  index: number;
}

function SidebarItem({ room, index }: SidebarItemProps) {
  const { selectedRoomIndex, setSelectedRoomIndex } = useChats();
  const { user } = useAuth();
  const recipient = room.users.filter(u => u.id !== user.id)[0];
  const isSelected = selectedRoomIndex === index;
  const hoverColor = useColorModeValue('#edf2f7', '#ffffff14');
  const selectedColor = useColorModeValue('#E2E8F0', '#ffffff29');

  return (
    recipient && (
      <Box width='full' p={2}>
        <Flex
          as={Button}
          width='full'
          py={8}
          px={5}
          alignItems='center'
          bgColor={isSelected && selectedColor}
          _hover={{ background: hoverColor }}
          justifyContent='flex-start'
          onClick={() => setSelectedRoomIndex(index)}
        >
          <Avatar
            size='md'
            name={recipient.name}
            mr={5}
            src={recipient.image}
          />
          <Text
            fontSize='1.1rem'
            fontWeight={500}
            display='flex'
            justifyContent='flex-start'
            isTruncated
            flex={1}
          >
            {recipient.name}
          </Text>
        </Flex>
      </Box>
    )
  );
}
