// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth(app);

export const getQuestionFromFirebase = async (noteID) => {
  if(!noteID) return;

  const queryQuestion = query(collection(db, 'Questions'), where("noteID", "==", noteID));
  const output = [];
  const querySnapshot = await getDocs(queryQuestion);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    output.push(doc.data());
  });
  return output;
};

export const deleteQuestionFromFirebase = async (graphID, questionID) => {
  if(!graphID || !questionID) return;
  await deleteDoc(doc(db, "graphs", `${graphID}`, 'questions', questionID));

  // await deleteDocuments(collection(db, "graphs", `${graphID}`, questionID));
}

const deleteDocuments = async (collectionRef) => {
  const querySnapshot = await getDocs(collectionRef);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc);
  });
};

export const createAnswerToFirebase = async (graphID, questionID, userID, output) => {
  const noteRef = doc(db, 'graphs', `${graphID}`, questionID, userID);
  const data = {
    ...output,
    timestamp: serverTimestamp(),
  }
  await setDoc(noteRef, data);
}

export const updateNote = async (graphID, noteID, content) => {
  const noteRef = doc(db, 'graphs', `${graphID}`, 'notes' ,`${noteID}`);
  const data = {
    content: content,
    timestamp: serverTimestamp()
  }
  await updateDoc(noteRef, data);
}

export const updateAnswerToFirebase = async (answerID, output) => {
  const noteRef = doc(db, 'Answers', answerID);
  await updateDoc(noteRef, output);
}


// export const getAnswerFromFirebase = async (graphID, questionID, userID) => {
//     const noteRef = doc(db, 'Answer', `${graphID}`, questionID, userID);

//     const noteSnap = await getDoc(noteRef);
//     if (noteSnap.exists()) {
//       console.log("getAnswerFromFirebase", noteSnap.data())
//       return noteSnap.data();
//     } else {
//       await createAnswerToFirebase(graphID, questionID, userID, {content: "Start typing your answer here!"})
//       .then(() => {
//         return {content: "Start typing your answer here!"}
//       })
//       return {content: "Start typing your answer here!"}
//   }
// };

export const getAnswerFromFirebase = async (loggedInUser) => {
  const queryQuestion = query(collection(db, 'Answers'), where("createdby", "==", loggedInUser.email));
  const output = [];
  const querySnapshot = await getDocs(queryQuestion);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    output.push(doc.data());
  });
  return output;
};

export const getNoteFromFirebase = async (graphID, noteID) => {
  const noteRef = doc(db, 'graphs', `${graphID}`, 'notes' ,`${noteID}`);
  const noteSnap = await getDoc(noteRef);
  if (noteSnap.exists()) {
    return noteSnap.data();
  } else {
    // doc.data() will be undefined in this case
    return null;
    
  }
 };

export { db, auth, storage };
