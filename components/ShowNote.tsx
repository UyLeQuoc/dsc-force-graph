import { Button, Col, Drawer, Empty, message, Popconfirm, Row, Skeleton, Space } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import Editor from './Editor';

type IProps = {
	graphInfoFirebase: any;
	modalNode: any;
	isViewer: boolean;
	drawer: {
		open: boolean;
		onClose: () => void;
		confirm: (e: React.MouseEvent<HTMLElement>) => void
	}
}
function ShowNote({graphInfoFirebase, modalNode, isViewer, drawer} : IProps) {
	const { open, onClose, confirm } = drawer;

	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);

	const getNoteFromFirebase = async (graphID, noteID) => {
		if(!graphID || !noteID) return;
		console.log("render ShowNote", graphID, noteID)
		const noteRef = doc(db, 'graphs', `${graphID}`, 'notes' ,`${noteID}`);
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
			getNoteFromFirebase(graphInfoFirebase.id, modalNode.id);
			// reset loading
			setTimeout(() => {
				setLoading(false);
			},2000)
			return () => {
				setLoading(true);
				setNoteFirebase(undefined);
				setIsEmpty(false)
			}
	},[modalNode.id]);


  return (
			<>
				<Drawer
					width={600}
					title={`${modalNode.name} - ${modalNode.group}`}
					placement={"right"}
					closable={true}
					onClose={onClose}
					open={open}
					extra={
						isViewer || (
							<Space>
								<Popconfirm
									title="Delete the node"
									description="Are you sure to delete this node?"
									onConfirm={confirm}
									okText="Yes"
									cancelText="No"
								>
									<Button type="primary" danger>Delete</Button>
								</Popconfirm>
								<Button type="primary">
									<Link
										href={`/${graphInfoFirebase.id}/${modalNode.id}`} 
										rel="noopener noreferrer" 
										target="_blank"
										style={{color: 'white'}}
									>
											View
									</Link>
								</Button>
							</Space>
							)
					}
					footer={
						<Button type="primary" onClick={onClose}>View Question</Button>
					}
				>
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
				</Drawer>
				
			</>
  )
}

export default ShowNote