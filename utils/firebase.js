// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_APIKEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
//   projectId: process.env.NEXT_PUBLIC_PROJECTID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
//   appId: process.env.NEXT_PUBLIC_APPID,
//   measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID
// };
const firebaseConfig = {
  apiKey: "AIzaSyAmIDOo6WZJ-4qJx4fx5tUk0g4UKcH0ufc",
  authDomain: "dsc-graph.firebaseapp.com",
  projectId: "dsc-graph",
  storageBucket: "dsc-graph.appspot.com",
  messagingSenderId: "319554476578",
  appId: "1:319554476578:web:bd87c7860361e9434b087b",
  measurementId: "G-YJ6S22CRC8"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth(app);

export {db, auth, storage}