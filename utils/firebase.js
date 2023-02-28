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

export const updateNote = async (noteID, content) => {
  const noteRef = doc(db, 'Notes' ,`${noteID}`);
  const data = {
    content: content,
    timestamp: serverTimestamp()
  }
  await updateDoc(noteRef, data);
}

export const updateAnswer = async (answerID, content) => {
  const noteRef = doc(db, 'Answers' ,`${answerID}`);
  const data = {
    content: content,
    lastupdate: serverTimestamp()
  }
  await updateDoc(noteRef, data);
}

export const getAnswerFromFirebase = async (loggedInUser) => {
  const queryQuestion = query(collection(db, 'Answers'), where("createdby", "==", loggedInUser.email));
  const output = new Map();
  const querySnapshot = await getDocs(queryQuestion);
  const map = new Map();
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    output.set(doc.data().questionID, doc.data());
  });
  return output;
};

// Create Note In Firebase
export const createNote = async (noteID, loggedInUser) => {
  const noteRef = doc(db, 'Notes' ,`${noteID}`);
  const data = {
    owner: loggedInUser.uid,
    content: '<h1>Start typing...</h1>',
    timestamp: serverTimestamp(),
  }
  await setDoc(noteRef, data);
  return data;
}
export const createAnswer = async (questionID, email) => {
  const id = uuidv4();
  const noteRef = doc(db, 'Answers' ,`${id}`);
  const data = {
    id: id,
    questionID: questionID,
    createdby: email,
    content: '<h1>Type the answer...</h1>',
    createdate: serverTimestamp(),
  }
  await setDoc(noteRef, data);
  return data;
}

export const getNoteFromFirebase = async (noteID) => {
  const noteRef = doc(db, 'Notes' ,`${noteID}`);
  const noteSnap = await getDoc(noteRef);
  if (noteSnap.exists()) {
    return noteSnap.data();
  } else {
    console.log("No such document!")
    // doc.data() will be undefined in this case
    return null;
  }
 };

 export const getUserFromFirebase = async (loggedInUser) => {
  const noteRef = doc(db, 'users' ,`${loggedInUser.uid}`);
  const noteSnap = await getDoc(noteRef);
  if (noteSnap.exists()) {
    return noteSnap.data();
  } else {
    return null;
  }
 };

 export const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, (error) => {
    // Handle unsuccessful uploads
  }, () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  });
  return uploadTask;
}


export async function getRole(user){
  const userDoc = await getDoc(doc(db, 'role', `${user?.uid}`));
  console.log(userDoc.data());
  if(!userDoc.exists()){
    await setDoc(doc(db, 'role', `${user?.uid}`), {role: 'user'});
    return 'user';
  }
  return userDoc.data().role;
}


export { db, auth, storage };
