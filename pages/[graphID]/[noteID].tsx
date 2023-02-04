
import { message, Skeleton } from 'antd';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Editor from '../../components/Editor';
import { auth, db } from '../../utils/firebase';


function App() {
	// read slug nextjs
	const { query } = useRouter();
	const { graphID, noteID } = query;

	const [loggedInUser, _loading, _error] = useAuthState(auth);

	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);

	const getNoteFromFirebase = async () => {
		const noteRef = doc(db, `${graphID}`, `${noteID}`);
		const noteSnap = await getDoc(noteRef);
		if (noteSnap.exists()) {
			setNoteFirebase(noteSnap.data())
		} else {
			// doc.data() will be undefined in this case
			alert('No such document!');
			createNote(graphID, noteID);
		}
 	};
 
	const createNote = async (graphID, noteID) => {
		const noteRef = doc(db,graphID, noteID);
		const data = {
			content: '<h1>Start typing...</h1>',
			timestamp: serverTimestamp()
		}
		await setDoc(noteRef, data);
		alert('Create new note!');
		setNoteFirebase(data);
	}

	const updateNote = async (content) => {
		const noteRef = doc(db, `${graphID}`, `${noteID}`);
		const data = {
			content: content,
			timestamp: serverTimestamp()
		}
		await updateDoc(noteRef, data);
		message.success('Note updated!');
	}
	useEffect( () => {
			if(graphID && noteID) {
				getNoteFromFirebase();
			}
			// reset loading
			setTimeout(() => {
				setLoading(false);
			},2000)
	},[]);

	return (
		<>
			<Editor noteFirebase={noteFirebase} loading={loading} updateNote={updateNote}/>
		</>
	);
}

export default App;
