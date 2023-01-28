import { Button, Drawer, message, Popconfirm, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import ForceGraph3D, { ForceGraphMethods, GraphData } from "react-force-graph-3d";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ILink } from "../interfaces";
import { db } from "../utils/firebase";
import AsideOptions from "./AsideOptions";
import { useRouter } from "next/router";
import ShowNote from "./ShowNote";
import * as THREE from 'three'
import {CSS2DRenderer, CSS2DObject} from 'three-css2drender'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'

type INode = {
	id: string;
	name: string;
	group: number;
	color: string;
	index: number;
	x, y, z: number;
	vx, vy, vz: number;
}

type IProps = {
	graphData: GraphData;
	handleLinkClick: any;
	removeNode: any;
	nodeID: string;
	setNodeID: any;
	nodeName: string;
	setNodeName: any;
	nodeGroup: string;
	setNodeGroup: any;
	addNode: any;
}

export default function BasicNodeChart({optionsModal, loggedInUser} : any) {
	// Node Data State
	const [nodeID, setNodeID] = useState('');
  const [nodeName, setNodeName] = useState('');
	const [nodeGroup, setNodeGroup] = useState('');
  const [nodeValue, setNodeValue] = useState(0);
  const [action, setAction] = useState(false);

	const [isNodeRemoving, setIsNodeRemoving] = useState(false);
	const [isLinkRemoving, setIsLinkRemoving] = useState(false);
	const [isLinking, setIsLinking] = useState(false);
	const [nodeToLink, setNodeToLink] = useState(null);
	// const [linkName, setLinkName] = useState('');
	// const [linkColor, setLinkColor] = useState('#888888');

	// Graph Options State
	const [enableFocusOnNode, setEnableFocusOnNode] = useState(false);
	const [enableNodeDrag, setEnableNodeDrag] = useState(true);
	const [enableShowLabels, setEnableShowLabels] = useState(true);
	const [enableShowLinks, setEnableShowLinks] = useState(true);
	const [enableShowDirected, setEnableShowDirected] = useState(true);

  const [graphData, setGraphData] = useState({ nodes: [], links: []});

	const router = useRouter();

  const addNode = () => {
		const node = {
			id: nodeID,
			group: parseInt(nodeGroup),
		};
		const newGraphData = { ...graphData };
		const nodesList = [...newGraphData.nodes] || [];
		nodesList.push(node);
		newGraphData.nodes = nodesList;

		setGraphData(newGraphData);
		setNodeName('');
		setNodeValue(0);
	}

	const removeNode = (node) => {
		const updateNode = graphData.nodes.filter(item => item.id !== node.id);
		const updateLinks = graphData.links.filter(item => item.target?.id !== node.id && item.source?.id !== node.id);

		const dataToUpdate = { ...graphData };
		dataToUpdate.nodes = updateNode;
		dataToUpdate.links = updateLinks;
		message.success('Removed node: ' + node.id + ' sucessfully');

		console.log('After remove', dataToUpdate);
		setGraphData(dataToUpdate);
	}

	const removeLink = (link) => {
		const updateLinks = graphData.links.filter(item => item !== link);
		console.log('updateLinks', updateLinks)
		const dataToUpdate = { ...graphData };
		dataToUpdate.links = updateLinks;
		message.success('Removed link from ' + link.source.id + ' to ' + link.target.id + ' sucessfully');

		setGraphData(dataToUpdate);
	}

	const fgRef = useRef<ForceGraphMethods>();
	const [modalNode, setModalNode] = useState<INode>(null);
	const [open, setOpen] = useState(false);

  const showDrawer = (node) => {
		setModalNode(node);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

	const handleLinkClick = (link) => {
		console.log('On Link Click: ', link);
		if (isLinkRemoving) return removeLink(link);
	}

  const handleNodeClick = (node) => {
		 console.log('nodeToLink: ', nodeToLink)
			if (isNodeRemoving) return removeNode(node);
      if(!isNodeRemoving && enableFocusOnNode && !isLinkRemoving && !isLinking){
				const distance = 80;
				const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
				if (fgRef.current) {
					console.log(fgRef.current, "Node", node);
					fgRef.current.cameraPosition(
						{
							x: node.x * distRatio,
							y: node.y * distRatio,
							z: node.z * distRatio
						},
						node,
						3000
					);
				}
			}

			if(!isNodeRemoving && !isLinkRemoving && !isLinking){
				showDrawer(node);
			}
			if (isLinking && !nodeToLink) {
				setNodeToLink(node);
				return;
			}
	
			else if (nodeToLink) {
				if (node === nodeToLink) {
					setNodeToLink(null);
					return;
				}
	
				const newLink : ILink = { source: nodeToLink, target: node };
				const updateData = { ...graphData };

				let isDuplicateLink = () => {
					let isDuplicate = false;
					updateData.links.forEach(link => {
						if (link.source.id === newLink.source.id && link.target.id === newLink.target.id) {
							isDuplicate = true;
						}
					});
					return isDuplicate;
				}
				if (!isDuplicateLink()) {
					const updateLinks = [...updateData.links, newLink];
					const updateNode = [...updateData.nodes];
					updateData.links = updateLinks;
					updateData.nodes = updateNode;
					setGraphData(updateData);
				}
			}
  }

	const activeLinking = () => {
		if (!isNodeRemoving && !isLinkRemoving && !isLinking) {
			setIsLinking(true);
		}
	}

	// firebase
	const [graphFirebase,setGraphFirebase] = useState<any>({ nodes: [], links: []});
	const [loading,setLoading] = useState<boolean>(true);
	console.log('graphFirebase',graphFirebase);

	const getUserFromFirebase = async () => {
		const userRef = doc(db,'users', loggedInUser.uid);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			console.log('User data: ', userSnap.data());
			setGraphFirebase(userSnap.data());
			setGraphData(userSnap.data().graph || {nodes:[],links:[]});
		}
		return;
 	};
 
	 const updateGraph = async () => {
		const graphRef = doc(db,'users', loggedInUser.uid);

		const output = {
			graph: {
				links: graphData.links.map(link => {
					return {
						source: link.source.id,
						target: link.target.id,
					}
				}) || [],
				nodes: graphData.nodes.map(node => {
					return {
						id: node.id,
						group: node.group,
					}
				}) || []
			}
		}
		console.log('data',output)

		await setDoc(graphRef, output, { merge: true });
		message.success('Graph updated!');
	}

	const confirm = (e: React.MouseEvent<HTMLElement>) => {
		removeNode(modalNode);
		onClose();
	};

	useEffect( () => {
			getUserFromFirebase();
			// reset loading
			setTimeout(() => {
				setLoading(false);
			},2000)
			
			// bloom effect
			// const bloomPass = new UnrealBloomPass();
			// console.log('bloomPass',bloomPass);
			// bloomPass.strength = 1;
			// bloomPass.radius = 1;
			// bloomPass.threshold = 0.1;
			// fgRef.current.postProcessingComposer().addPass(bloomPass);

	},[]);

	// graph effect
	const extraRenderers = [new CSS2DRenderer()];
	


  return (
		<>
			<AsideOptions
				optionsModal = {optionsModal}
				graphData={{
					nodeID, setNodeID,
					nodeName, setNodeName,
					nodeGroup, setNodeGroup,
					nodeValue, setNodeValue,
				}}
				dataOptions={{
					addNode,
					removeNode,
					isLinkRemoving, setIsLinkRemoving,
					isNodeRemoving, setIsNodeRemoving,
					isLinking, setIsLinking,
					activeLinking,
					updateGraph
				}}
				graphOptions={{
					enableFocusOnNode, setEnableFocusOnNode,
					enableNodeDrag, setEnableNodeDrag,
					enableShowLabels, setEnableShowLabels,
					enableShowLinks, setEnableShowLinks,
					enableShowDirected, setEnableShowDirected,
				}}
			/>
			<ForceGraph3D
				extraRenderers={extraRenderers}
				ref={fgRef}
				graphData={graphData}
				nodeLabel="id"
				nodeAutoColorBy="group"
				onNodeClick={handleNodeClick}
				onLinkClick={handleLinkClick}
				backgroundColor="#000000"
				// nodeThreeObject={node => {
				// 	const nodeEl = document.createElement('div');
				// 	nodeEl.textContent = node.id;
				// 	nodeEl.style.color = node.color;
				// 	nodeEl.className = 'node-label';
				// 	return new CSS2DRenderer(nodeEl);
				// }}
				nodeThreeObjectExtend={true}
				
				linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={(d : any ) => d?.value * 0.001}
				// Graph options
				enableNodeDrag = {enableNodeDrag}
				linkDirectionalArrowLength={enableShowDirected ? 4 : 0}
        linkDirectionalArrowRelPos={enableShowDirected ? 1 : 0}
			/>
			{
				modalNode && (
					<Drawer
						width={600}
						title="Basic Drawer"
						placement={"right"}
						closable={false}
						onClose={onClose}
						open={open}
						footer={
							<Space>
								<Popconfirm
									title="Delete the node"
									description="Are you sure to delete this node?"
									onConfirm={confirm}
									okText="Yes"
									cancelText="No"
								>
									<Button>Delete</Button>
								</Popconfirm>
							<Button type="primary" onClick={() => router.push(`/${loggedInUser.uid}/${modalNode.id}`)}>View {`/${loggedInUser.uid}/${modalNode.id}`}</Button>
							</Space>
						}
					>
						<Space direction="vertical">
							<div>ID: {modalNode.id}</div>
							<div>Group: {modalNode.group}</div>
							<div>Color: {modalNode.color}</div>
							<div>Index: {modalNode.index}</div>
							<div>x: {modalNode.x}, y: {modalNode.y}. z: {modalNode.z}</div>
							<div>vx: {modalNode.vx}, vy: {modalNode.vy}. vz: {modalNode.vz}</div>
							<ShowNote userID={loggedInUser.uid} noteID={modalNode.id} />
						</Space>

					</Drawer>
				)
			}
		</>
  );
}