import { usePrevious } from '@chakra-ui/react';
import { Message, Room } from 'interfaces';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import useAuth from '../hooks/useAuth';
import useSocket from './SocketProvider';

interface ChatsContext {
  rooms: Room[];
  selectedRoom: Room;
  setSelectedRoomIndex: Dispatch<SetStateAction<number>>;
  selectedRoomIndex: number;
  joinRoom: JoinRoom;
  sendMessage: SendMessage;
  messages: Message[];
}

type JoinRoom = (params: { roomId?: string; secondUser?: string }) => void;

type SendMessage = (text: string) => void;

interface ReceiveMessageArgs {
  message: Message;
  roomId: string;
}

const ChatsContext = createContext<ChatsContext>(null);

export default function useChats() {
  return useContext(ChatsContext);
}

export const ChatsProvider: React.FC = ({ children }) => {
  const socket = useSocket();

  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { user } = useAuth();

  const selectedRoom = rooms[selectedRoomIndex];
  const previousRoom = usePrevious(selectedRoom);

  useEffect(() => {
    if (!selectedRoom || !socket) return;

    if (previousRoom) {
      socket.emit('disconnect-room', {
        roomId: previousRoom.id,
      });
    }

    socket.emit('render-messages-request', {
      roomId: selectedRoom.id,
    });

    socket.on('receive-message', ({ message, roomId }: ReceiveMessageArgs) => {
      if (selectedRoom?.id === roomId) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    joinRoom({ roomId: selectedRoom.id });

    return () => {
      socket.off('receive-message');
    };
  }, [selectedRoom, socket]);

  useEffect(() => {
    if (socket == null) return;

    socket.emit('send-rooms');

    socket.on('get-rooms', ({ rooms }: { rooms: Room[] }) => {
      setRooms(rooms);
    });

    socket.on('render-messages-response', ({ messages }) => {
      setMessages(messages);
    });

    return () => {
      socket.off('render-messages-response');
      socket.off('get-rooms');
    };
  }, [socket]);

  const joinRoom: JoinRoom = ({ roomId, secondUser }) => {
    socket.emit('join', {
      users: [user.id, secondUser],
      roomId,
    });

    if (!roomId) {
      socket.emit('send-rooms');
    }
  };

  const sendMessage: SendMessage = text => {
    socket.emit('send-message', { text, roomId: selectedRoom.id });
  };

  const value: ChatsContext = {
    rooms,
    selectedRoom,
    setSelectedRoomIndex,
    selectedRoomIndex,
    joinRoom,
    sendMessage,
    messages,
  };

  return (
    <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>
  );
};
