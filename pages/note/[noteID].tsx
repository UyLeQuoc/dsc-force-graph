
import { Col, Row } from 'antd';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Editor from '../../components/Editor';
import QuestionList from '../../components/QuestionSection/QuestionList';
import { IQuestion } from '../../interfaces';
import { auth, db, getAnswerFromFirebase, getNoteFromFirebase, getQuestionFromFirebase, updateNote } from '../../utils/firebase';

function App() {
	// read slug nextjs
	const router = useRouter();
	const { noteID } = router.query;

	const [loggedInUser, _loading, _error] = useAuthState(auth);
	console.log('loggedInUser', loggedInUser)
	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);
	const [questionList, setQuestionList] = useState<IQuestion[]>([]);
	const [answerList, setAnswerList] = useState<any>([]);
	const [isReadable, setIsReadable] = useState<boolean>(true);
	console.log('answerList', answerList)

	useEffect( () => {
			if(noteID) {
				getNoteFromFirebase(noteID)
				.then((res) => {
					setNoteFirebase(res);
					setIsReadable(res.owner !== loggedInUser.uid);
					setLoading(false);
					if(!res){
						router.back();
					}
					return () => {
						setLoading(true);
						setNoteFirebase(undefined);
					}
				})
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
		<Row className='p-10'>
			<Col span={20} offset={2}>
				<h3 className='mb-2'>Note ID: {noteID}</h3>
				<Editor noteFirebase={noteFirebase} loading={loading} updateNote={(content) => updateNote(noteID, content)} isReadable={isReadable}/>
			</Col>
			{
				questionList && <QuestionList questionList={questionList} setQuestionList={setQuestionList} answerList={answerList} setAnswerList={setAnswerList} loggedInUser={loggedInUser} noteID={`${noteID}`}/>
			}
		</Row>
	);
}

export default App;
