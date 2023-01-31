import { Button, Drawer, message, Popconfirm, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import ForceGraph3D, { ForceGraphMethods, GraphData, NodeObject, LinkObject } from "react-force-graph-3d";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import AsideOptions from "./AsideOptions";
import { useRouter } from "next/router";
import ShowNote from "./ShowNote";
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { v4 as uuidv4 } from 'uuid';


export default function BasicNodeChart({optionsModal, loggedInUser} : any) {
	// Node Data State
  const [nodeName, setNodeName] = useState<string>('');
	const [nodeGroup, setNodeGroup] = useState<string>('');
  const [nodeValue, setNodeValue] = useState<number>(0);
  const [action, setAction] = useState(false);

	const [isNodeRemoving, setIsNodeRemoving] = useState(false);
	const [isLinkRemoving, setIsLinkRemoving] = useState(false);
	const [isLinking, setIsLinking] = useState(false);
	const [nodeToLink, setNodeToLink] = useState<NodeObject>(null);
	// const [linkName, setLinkName] = useState('');
	// const [linkColor, setLinkColor] = useState('#888888');

	// Graph Options State
	const [enableFocusOnNode, setEnableFocusOnNode] = useState(false);
	const [enableNodeDrag, setEnableNodeDrag] = useState(true);
	const [enableShowLabels, setEnableShowLabels] = useState(true);
	const [enableShowLinks, setEnableShowLinks] = useState(true);
	const [enableShowDirected, setEnableShowDirected] = useState(true);

  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: []});

	const router = useRouter();

  const addNode = () => {
		if(!nodeName || !nodeGroup) return message.error('Node name and Node Group is required');

		const node = {
			id: uuidv4(),
			name: nodeName,
			group: nodeGroup,
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
		const updateLinks = graphData.links.filter((item : any) => item.target?.id !== node.id && item.source?.id !== node.id);

		const dataToUpdate = { ...graphData };
		dataToUpdate.nodes = updateNode;
		dataToUpdate.links = updateLinks;
		message.success('Removed node: ' + node.id + ' sucessfully');

		console.log('After remove', dataToUpdate);
		setGraphData(dataToUpdate);
	}

	const removeLink = (link : LinkObject | any) => {
		const updateLinks = graphData.links.filter(item => item !== link);
		const dataToUpdate = { ...graphData };
		dataToUpdate.links = updateLinks;
		message.success('Removed link from ' + link.source.id + ' to ' + link.target.id + ' sucessfully');
		setGraphData(dataToUpdate);
	}

	const fgRef = useRef<ForceGraphMethods>();
	const [modalNode, setModalNode] = useState<NodeObject | any>(null);
	const [open, setOpen] = useState(false);

	console.log('graphData testing', graphData);
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

	const getGraphFilterAttribute = (graph: GraphData) => {
		return {
			nodes: graph.nodes.map((node : NodeObject | any) => {
				return {
					id: node.id,
					name: 'test',
					group: node.group,
				}
			}),
			links: graphData.links.map((link : LinkObject | any) => {
				return {
					source: link.source.id,
					target: link.target.id,
					value: link.value,
				}
			})
		}
	}
  const handleNodeClick = (node: NodeObject | any) => {
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
	
				const newLink : LinkObject = { source: nodeToLink.id, target: node.id };
				const updateData : GraphData | any = { ...graphData };

				let isDuplicateLink = () => {
					let isDuplicate = false;
					updateData.links.forEach(link => {
						console.log(link.source, newLink.source, link.target, newLink.target);
						if (link.source.id === newLink.source && link.target.id === newLink.target) {
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
		if(isLinking){
			setIsLinking(false);
			setNodeToLink(null);
			return;
		}
		if (!isNodeRemoving && !isLinkRemoving && !isLinking) {
			setIsLinking(true);
		}
	}

	// firebase
	const [graphFirebase,setGraphFirebase] = useState<any>({ nodes: [], links: []});
	const [loading,setLoading] = useState<boolean>(true);

	const getUserFromFirebase = async () => {
		const userRef = doc(db,'users', loggedInUser.uid);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			setGraphFirebase(userSnap.data());
			setGraphData({
				nodes: userSnap.data().graph?.nodes,
				links: userSnap.data().graph?.links,
			} || {nodes:[],links:[]});
		}
		return;
 	};
 
	 const updateGraph = async () => {
		const graphRef = doc(db,'users', loggedInUser.uid);

		const output = {
			graph: {
				links: graphData.links.map((link : any) => {
					console.log('link tsting',link)
					return {
						source: link.source.id,
						target: link.target.id,
						value: 1,
					}
				}) || [],
				nodes: graphData.nodes.map((node : NodeObject|any) => {
					return {
						id: node.id,
						group: node.group,
						name: node.name,
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
			const bloomPass = new UnrealBloomPass();
			console.log('bloomPass',bloomPass);
			bloomPass.strength = 1;
			bloomPass.radius = 1;
			bloomPass.threshold = 0.1;
			fgRef.current.postProcessingComposer().addPass(bloomPass);

	},[]);

	// graph effect
	const extraRenderers = [new CSS2DRenderer()];
	


  return (
		<>
			<AsideOptions
				optionsModal = {optionsModal}
				graphData={{
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
				nodeLabel="name"
				nodeAutoColorBy="group"
				onNodeClick={handleNodeClick}
				onLinkClick={handleLinkClick}
				backgroundColor="#000000"
				nodeThreeObject={node => {
					const nodeEl = document.createElement('div');
					nodeEl.textContent = node.name;
					nodeEl.style.color = node.color;
					nodeEl.className = 'node-label';
					return new CSS2DObject(nodeEl);
				}}
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
						closable={true}
						onClose={onClose}
						open={open}
						extra={
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
							<Button type="primary" onClick={() => router.push(`/${loggedInUser.uid}/${modalNode.id}`)}>View</Button>
							</Space>
						}
					>
						<Space direction="vertical">
							<div>ID: {modalNode.id}</div>
							<div>Name: {modalNode.name}</div>
							<div>Group: {modalNode.group}</div>
							<div>Color: {modalNode.color}</div>
							<div>x: {modalNode.x}, y: {modalNode.y}. z: {modalNode.z}</div>
							<div>vx: {modalNode.vx}, vy: {modalNode.vy}. vz: {modalNode.vz}</div>
							<ShowNote userID={loggedInUser.uid} noteID={`${modalNode.id}`} />
						</Space>

					</Drawer>
				)
			}
		</>
  );
}