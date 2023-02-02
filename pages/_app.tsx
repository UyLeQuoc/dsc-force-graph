import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '../components/Loading';
import LoginPage from '../components/LoginPage';
import { auth, db } from '../utils/firebase';

import '../styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, error] = useAuthState(auth);

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
    // Check the conversation already exist in Firebase
    // const queryGetConversationsForCurrentUser = query(collection(db,'conversations'), where('users', 'array-contains', loggedInUser.email))
    // const [conversationsSnapshot] = useCollection(queryGetConversationsForCurrentUser)
    // const isConversationAlreadyExisted = (recipientEmail) => {
    //     return conversationsSnapshot?.docs.find(conversation => (conversation.data().users.includes(recipientEmail)))
    // }
    // const createConversation = async () => {
    //   if (!isConversationAlreadyExisted("uylqse172445@fpt.edu.vn")){
    //     // Add conversation to Firebase ("conversation collection")
    //     await addDoc(collection(db, 'conversations'), {
    //       users: [loggedInUser?.email, "uylqse172445@fpt.edu.vn"]
    //     })
    //   }
    // };
    // createConversation();
  }
  , [loggedInUser])

  

  if (loading) return <Loading />
  
  if (!loggedInUser) return <LoginPage />

  return <Component {...pageProps} />
}

export default MyApp;