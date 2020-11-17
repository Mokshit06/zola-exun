import useAuth from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <h1>Loading...</h1>;
  if (!isAuthenticated) return <h1>Unauthenticated</h1>;

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <img src={user.image} />
      <p>{user.socialId}</p>
      <p>{user.id}</p>
    </div>
  );
}
