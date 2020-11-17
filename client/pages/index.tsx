import useAuth from '../hooks/useAuth';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
