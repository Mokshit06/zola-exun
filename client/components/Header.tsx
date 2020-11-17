import useAuth from '../hooks/useAuth';

export default function Header() {
  const { login, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <ul>
        {isAuthenticated ? (
          <li onClick={logout}>Logout</li>
        ) : (
          <li onClick={login}>Login</li>
        )}
      </ul>
    </div>
  );
}
