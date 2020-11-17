import useAuth from '../hooks/useAuth';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket>(null);

export default function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket>(null);
  const { user } = useAuth();
  const socketURL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (user) {
      const newSocket = io(socketURL, {
        query: { id: user.id },
        secure: true,
      });

      setSocket(newSocket);

      return () => {
        newSocket?.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
