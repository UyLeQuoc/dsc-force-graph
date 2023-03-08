import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '../components/Loading';
import { auth, db } from '../utils/firebase';

import { useRouter } from 'next/router';
import { AuthProvider } from '../auth/AuthProvider';
import '../styles/index.css';
import Login from './login';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, error] = useAuthState(auth);
  console.log("LOGGED IN USER", loggedInUser);

  useEffect(() => {
    const setUserInFirebase = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser.uid),
          {
            email: loggedInUser.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser.photoURL,
          },
          {merge: true}
        )
      } catch(error) {
        console.log("ERROR SETTING USER INFO IN FIREBASE", error)
      }
    }
    if (loggedInUser){
      setUserInFirebase();
    }
  }
  , [loggedInUser])

  const { asPath } = useRouter();
  const cleanPath = asPath.split('#')[0].split('?')[0];

  if (loading) return <Loading />

    if(cleanPath.slice(1,5) !== 'view') {
      if (!loggedInUser) return <Login />
    }
  
  return <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
}

export default MyApp;