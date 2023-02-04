import { Col, Empty, message, Row, Skeleton } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import Editor from './Editor';

function ShowNote({graphID, noteID} : {graphID: string, noteID: string}) {
	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);
	console.log('noteFirebase',noteFirebase, loading);

	const getNoteFromFirebase = async (graphID, noteID) => {
		if(!graphID || !noteID) return;
		console.log("render ShowNote", graphID, noteID)
		const noteRef = doc(db,`${graphID}`, `${noteID}`);
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
			getNoteFromFirebase(graphID, noteID);
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
					<Row align="middle" style={{height: '100%'}}>
						<Col span={24}>
							<Empty description="No Note Found" />
						</Col>
					</Row>
				) : (
					<Skeleton loading={loading} active>
						<Editor noteFirebase={noteFirebase} loading={loading} isReadable={true} updateNote={undefined} />
					</Skeleton>
				)
			}
    </>
  )
}

export default ShowNote