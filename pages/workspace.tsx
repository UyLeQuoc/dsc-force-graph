import { collection, query, where, getDocs } from "firebase/firestore";import { useAuthState } from "react-firebase-hooks/auth";
import GraphCard from '../components/GraphCard'
import { auth, db } from "../utils/firebase";
import { useEffect, useState } from 'react'
import { IGraphInfo } from "../interfaces";
import { Space } from "antd";

function Workspace() : JSX.Element {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const [graphs, setGraphs] = useState<IGraphInfo[] | any>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect( () => {
    getGraphsFromFireBase();
    // reset loading
    setTimeout(() => {
      setLoading(false);
    },2000)

},[]);


  return (
    <>
      <div>Workspace</div>
      <Space direction="vertical" size={16}>
      {
        graphs.map((graph) => (
          <GraphCard id={graph.id} title={graph.title} owner={graph.owner} lastModified={graph.lastModified} />
        ))
      }
      </Space>
    </>
  )
}

export default Workspace