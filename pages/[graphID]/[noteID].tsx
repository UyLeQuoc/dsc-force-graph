
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Editor from '../../components/Editor';
import QuestionList from '../../components/QuestionSection/QuestionList';
import { IQuestion } from '../../interfaces';
import { auth, db, getAnswerFromFirebase, getQuestionFromFirebase, updateNote } from '../../utils/firebase';

function App() {
	// read slug nextjs
	const { query } = useRouter();
	const { graphID, noteID } = query;

	const [loggedInUser, _loading, _error] = useAuthState(auth);
	console.log('loggedInUser', loggedInUser)
	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);
	const [questionList, setQuestionList] = useState<IQuestion[]>([]);
	const [answerList, setAnswerList] = useState<any>([]);
	console.log('answerList', answerList)
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
				getQuestionFromFirebase(noteID).then((res) => {
					setQuestionList(res)
				})
				getAnswerFromFirebase(loggedInUser).then((res) => {
					setAnswerList(res)
				})
			}
			// reset loading
			setTimeout(() => {
				setLoading(false);
			},2000)

			
			return () => {
				setQuestionList([])
				setAnswerList([])
			}
	},[]);

	return (
		<div className='p-10'>
			<h3 className='mb-2'>Note ID: {noteID}</h3>
			<Editor noteFirebase={noteFirebase} loading={loading} updateNote={(content) => updateNote(graphID,noteID, content)} />
			{
				questionList && <QuestionList questionList={questionList} setQuestionList={setQuestionList} answerList={answerList} setAnswerList={setAnswerList} loggedInUser={loggedInUser} graphID={`${graphID}`} noteID={`${noteID}`}/>
			}
		</div>
	);
}

export default App;
