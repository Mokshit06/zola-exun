import { Auth } from 'components/Auth';
import useAuth from 'hooks/useAuth';

function Login() {
  const { login } = useAuth();

  return (
    <div>
      <button onClick={() => login('google')}>Login with Google</button>
      <button onClick={() => login('discord')}>Login with Discord</button>
    </div>
  );
}

export default Auth(Login);
