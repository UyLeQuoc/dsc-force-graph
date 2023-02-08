// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, query, Timestamp, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
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

export const getQuestionFromFirebase = async (graphID, noteID) => {
  if(!graphID || !noteID) return;

  const queryQuestion = query(collection(db, "graphs", `${graphID}`, 'questions'), where("noteID", "==", noteID));
  const output = [];
  const querySnapshot = await getDocs(queryQuestion);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    output.push(doc.data());
  });
  return output;
};

export const addQuestionToFirebase = async (graphID, noteID, output) => {
  if(!graphID || !noteID) return;
  const docRef = await addDoc(collection(db, "graphs", `${graphID}`, 'questions'), output);
  console.log("Document written with ID: ", docRef.id);
}

export {db, auth, storage}