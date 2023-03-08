import { collection, query, where, getDocs, doc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";import { useAuthState } from "react-firebase-hooks/auth";
import GraphCard from '../components/GraphCard'
import { auth, db } from "../utils/firebase";
import { useEffect, useState } from 'react'
import { IGraphInfo } from "../interfaces";
import { Button, Input, message, Modal, Space, Typography } from "antd";
import { v4 as uuidv4 } from 'uuid';
import MainFooter from "../components/common/MainFooter";
import MainHeader from "../components/common/MainHeader";

function Workspace() : JSX.Element {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const [graphs, setGraphs] = useState<IGraphInfo[] | any>([]);
  const [graphTitle, setGraphTitle] = useState<string>('New Graph');
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);

  const getGraphsFromFireBase = async () : Promise<void> => {
    const q = query(collection(db, "graphs"), where("owner", "==", loggedInUser.uid));
    const output = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      output.push({
        id: doc.id,
        ...doc.data()
      });
      console.log(doc.id, " => ", doc.data());
    });
    console.log(output)
    setGraphs(output);
  }

  const handleRenameGraphTitle = async (graphRenameID, graphTitle) : Promise<void> => {
    const graphRef = doc(db,'graphs', graphRenameID);

		const output = {
			title: graphTitle,
			lastModified: serverTimestamp(),
		}
		console.log('data',output)

		await setDoc(graphRef, output, { merge: true });
		message.success('Rename Successfully!');
  }

  const handleCreateGraph = async () : Promise<void> => {
    const graphID = uuidv4();
    const output = {
      id: graphID,
      title: graphTitle,
      owner: loggedInUser.uid,
      lastModified: serverTimestamp(),
      graph: {
        nodes: [],
        links: []
      }
    }

    const graphRef = doc(db,'graphs', graphID);
    await setDoc(graphRef, output);
    setGraphTitle("");
    setGraphs([...graphs, output]);
    message.success('Create Graph Successfully!');
  }

  useEffect( () => {
    getGraphsFromFireBase();
    // reset loading
    setTimeout(() => {
      setLoading(false);
    },2000)
},[]);

const handleDeleteGraph = async (graphID) : Promise<void> => {
  const graphRef = doc(db,'graphs', graphID);
  await deleteDoc(graphRef);
  setGraphs(graphs.filter((graph) => graph.id !== graphID));
  message.success('Delete Graph Successfully!');
}

const showModal = () => {
  setOpen(true);
};

const handleOk = () => {
  handleCreateGraph();
  setOpen(false);
};

const handleCancel = () => {
  setOpen(false);
  setGraphTitle("");
};

  return (
    <>
      <MainHeader show={true}/>
      <div className="mt-[64px]">Workspace</div>
      <div>
        <Button type="primary" onClick={showModal}>Create new graph</Button>
      </div>
      <Space direction="vertical" size={16}>
      {
        graphs.map((graph) => (
          <GraphCard id={graph.id} title={graph.title} owner={graph.owner} lastModified={graph.lastModified} handleRenameGraphTitle={handleRenameGraphTitle} handleDeleteGraph={handleDeleteGraph}/>
        ))
      }
      </Space>
      <Modal
        title={"Create Graph"}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography.Text>Create a new graph name:</Typography.Text>
        <Input placeholder="New Graph Name" value={graphTitle} onChange={(e) => setGraphTitle(e.target.value)}/>
      </Modal>
      <MainFooter />
    </>
  )
}

export default Workspace