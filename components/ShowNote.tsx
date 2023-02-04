import { Empty, message } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import Editor from './Editor';

function ShowNote({userID, noteID} : {userID: string, noteID: string}) {
	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);
	console.log('noteFirebase',noteFirebase, loading);

	const getNoteFromFirebase = async (userID, noteID) => {
		if(!userID || !noteID) return;
		console.log("render ShowNote", userID, noteID)
		const noteRef = doc(db, `${userID}`, `${noteID}`);
		const noteSnap = await getDoc(noteRef);
		if (noteSnap.exists()) {
			setNoteFirebase(noteSnap.data())
		} else {
			// doc.data() will be undefined in this case
			setIsEmpty(true);
      message.error('No such document!');
		}
 	};
 
	useEffect( () => {
			getNoteFromFirebase(userID, noteID);
			// reset loading
			setTimeout(() => {
				setLoading(false);
			},2000)
			return () => {
				setLoading(true);
				setNoteFirebase(undefined);
				setIsEmpty(false)
			}
	},[noteID]);


  return (
    <>
      {
				isEmpty ? (
					<Empty />
				) : (
					<Editor noteFirebase={noteFirebase} loading={loading} isReadable={true} updateNote={undefined} />
				)
			}
    </>
  )
}

export default ShowNote