import useSocket from 'contexts/SocketProvider';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const { user, logout } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    console.log(socket);
  }, [socket]);

  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
