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

export const updateAnswerToFirebase = async (graphID, questionID, userID, content) => {
  const noteRef = doc(db, 'graphs', `${graphID}`, questionID, userID);
  const data = {
    content: content,
    timestamp: serverTimestamp()
  }
  await updateDoc(noteRef, data);
}


export const getAnswerFromFirebase = async (graphID, questionID, userID) => {
    const noteRef = doc(db, 'graphs', `${graphID}`, questionID, userID);
    const noteSnap = await getDoc(noteRef);
    if (noteSnap.exists()) {
      console.log("getAnswerFromFirebase", noteSnap.data())
      return noteSnap.data();
    } else {
      await createAnswerToFirebase(graphID, questionID, userID, {content: "Start typing your answer here!"})
      .then(() => {
        return {content: "Start typing your answer here!"}
      })
      return {content: "Start typing your answer here!"}
  }
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

//  export const imageUpload = async (questionID, image) => {
//   const metadata = {
//     contentType: 'image/jpeg'
//   };

//   const questionImageID = uuidv4();
//   const questionImagesRef = ref(storage, 'questions/' + questionID + '/images/' + questionImageID);
//   const uploadTask = uploadBytesResumable(questionImagesRef, image.thumbUrl, metadata);

//   // Listen for state changes, errors, and completion of the upload.
//   await uploadTask.on('state_changed',
//   (snapshot) => {
//     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log('Upload is ' + progress + '% done');
//     switch (snapshot.state) {
//       case 'paused':
//         console.log('Upload is paused');
//         break;
//       case 'running':
//         console.log('Upload is running');
//         break;
//     }
//   }, 
//   (error) => {
//     // A full list of error codes is available at
//     // https://firebase.google.com/docs/storage/web/handle-errors
//     switch (error.code) {
//       case 'storage/unauthorized':
//         // User doesn't have permission to access the object
//         break;
//       case 'storage/canceled':
//         // User canceled the upload
//         break;

//       // ...

//       case 'storage/unknown':
//         // Unknown error occurred, inspect error.serverResponse
//         break;
//     }
//   }, 
//   async () => {
//     // Upload completed successfully, now we can get the download URL
//     await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//       console.log('File available at', downloadURL);
//       return {
//         url: downloadURL,
//         questionImageID: questionImageID
//       };
//     })
//   }
//   );
// };

// export const multipleImageUpload = async (questionID, imageFileList) => {
//   let imagesUrlArray = [];
//   // array of files
//   let arr = imageFileList.map((item) => {
//     return item;
//   });

//   for (let i = 0; i < arr.length; i++) {
//     await imageUpload(questionID, arr[i])
//     .then((url) => {
//       imagesUrlArray.push(url);
//       console.log("imagesUrlArray", imagesUrlArray)
//     })
//   }

//   return imagesUrlArray; // array of URLS of uploaded files
// }

export const multiImage = async (questionID, imageFileList) => {
  /* eslint no-var: 0 */
  const imagesUrlArray = [];
  /* eslint no-var: 0 */
  for (let i = 0; i < imageFileList.length; i++) {
      const id = uuidv4();
      /* eslint-disable no-await-in-loop */
      const storageRef = ref(storage, 'questions/' + questionID + '/images/' + id);
      const uploadTask = uploadBytesResumable(storageRef, imageFileList[i], {
        contentType: 'image/png',
      });
      uploadTask.on('state_changed', 
      (snapshot) => {
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
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      async () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          imagesUrlArray.push(downloadURL);
        });
        console.log("imagesUrlArray", imagesUrlArray)
      });      
  } // array of URLS of uploaded files
  console.log("imagesUrlArray222", imagesUrlArray)
  return imagesUrlArray;
};




export { db, auth, storage };
