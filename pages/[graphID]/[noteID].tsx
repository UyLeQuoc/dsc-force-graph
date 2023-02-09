
import { message, Skeleton } from 'antd';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Editor from '../../components/Editor';
import QuestionList from '../../components/QuestionSection/QuestionList';
import QuestionsModal from '../../components/QuestionSection/QuestionsModal';
import { IQuestion } from '../../interfaces';
import { auth, db, getQuestionFromFirebase, updateNote } from '../../utils/firebase';

function App() {
	// read slug nextjs
	const { query } = useRouter();
	const { graphID, noteID } = query;

	const [loggedInUser, _loading, _error] = useAuthState(auth);

	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);
	const [questionList, setQuestionList] = useState<IQuestion[]>([]);

	const getNoteFromFirebase = async () => {
		const noteRef = doc(db, 'graphs', `${graphID}`, 'notes' ,`${noteID}`);
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
		const noteRef = doc(db, 'graphs', `${graphID}`, 'notes' ,`${noteID}`);
		const data = {
			content: '<h1>Start typing...</h1>',
			timestamp: serverTimestamp(),
			owner: loggedInUser.uid
		}
		await setDoc(noteRef, data);
		alert('Create new note!');
		setNoteFirebase(data);
	}

	useEffect( () => {
			if(graphID && noteID) {
				getNoteFromFirebase();
				getQuestionFromFirebase(graphID,noteID).then((res) => {
					setQuestionList(res)
				})
			}
			// reset loading
			setTimeout(() => {
				setLoading(false);
			},2000)

			
			return () => {
				setQuestionList([])
			}
	},[]);

	return (
		<>
			<Editor noteFirebase={noteFirebase} loading={loading} updateNote={(content) => updateNote(graphID,noteID, content)} />
			{/* //QuestionModal */}
			<QuestionsModal graphID={`${graphID}`} noteID={`${noteID}`} loggedInUser={loggedInUser}/>
			{
				questionList && <QuestionList loggedInUser={loggedInUser} graphID={`${graphID}`} noteID={`${noteID}`} questionList={questionList}/>
			}
		</>
	);
}

export default App;
