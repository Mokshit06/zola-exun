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

const ChatsContext = createContext<ChatsContext>(null);

export default function useChats() {
  return useContext(ChatsContext);
}

export const ChatsProvider: React.FC = ({ children }) => {
  const socket = useSocket();

  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  const selectedRoom = rooms[selectedRoomIndex];

  useEffect(() => {
    if (socket == null) return;

    socket.emit('send-rooms');

    socket.on('get-rooms', ({ rooms }) => {
      setRooms(rooms);
    });

    return () => {
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
    socket.emit('send-message', { text, roomId: selectedRoom._id });
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
