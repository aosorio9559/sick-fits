import SignIn from './SignIn';
import { useUser } from './User';

export default function ({ children }) {
  const me = useUser();
  if (!me) return <SignIn />;
  return children;
}