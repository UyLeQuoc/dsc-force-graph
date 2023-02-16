import { Button, Col, Drawer, Empty, message, Modal, Popconfirm, Row, Skeleton, Space } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createNote, db, getNoteFromFirebase, getQuestionFromFirebase } from '../utils/firebase';
import Editor from './Editor';

type IProps = {
	graphInfoFirebase: any;
	modalNode: any;
	isViewer: boolean;
	drawer: {
		open: boolean;
		onClose: () => void;
		confirm: (e: React.MouseEvent<HTMLElement>) => void;
	}
	loggedInUser: any;
	updateGraph: () => void;
}
function ShowNote({graphInfoFirebase, modalNode, isViewer, drawer, loggedInUser, updateGraph} : IProps) {
	const { open, onClose, confirm } = drawer;

	// firebase
	const [noteFirebase,setNoteFirebase] = useState<any>();
	const [loading,setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);
 
	useEffect( () => {
			getNoteFromFirebase(modalNode.id)
			.then((res) => {
				setNoteFirebase(res)
				if(!res) {
					setIsEmpty(true);
				}
				setLoading(false);
			})
			return () => {
				setLoading(true);
				setNoteFirebase(undefined);
				setIsEmpty(false)
			}
	},[modalNode.id]);

	const handleCreateNote = async () => {
		createNote(modalNode.id,loggedInUser)
		.then((res) => {
			setNoteFirebase(res)
			setIsEmpty(false)
			updateGraph();
		})
	}
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
										href={`/note/${modalNode.id}`} 
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
				>
						{
							isEmpty ? (
								<Row align="middle" style={{height: '100%'}}>
									<Col span={24}>
										<Empty description="No Note Found" />
										{
											!isViewer && (
												<Button type="primary" onClick={handleCreateNote}>Create Note</Button>
											)
										}
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