import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {auth} from '../utils/firebase'
import { signOut } from "firebase/auth";

export default function LoginPage() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const signIn = () => {
    signInWithGoogle();
  }

  return (
    <div>LoginPage
      <section className="bg-orange-400">
        <button onClick={signIn}>sign In With Google</button>
        <p>{JSON.stringify(user)}</p>
        <button onClick={() => signOut(auth)}>Log out</button>
      </section>

    </div>
  )
}
