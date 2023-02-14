import { message, notification } from "antd";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ForceGraph3D, { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { v4 as uuidv4 } from 'uuid';
import { IGraphInfo } from '../interfaces/index';
import { db } from "../utils/firebase";
import AsideOptions from "./AsideOptions";
import ShowNote from "./ShowNote";
import UIGraphController from "./UIGraphController";

export default function BasicNodeChart({loggedInUser, graphID} : any) : JSX.Element {
	const [isViewer, setIsViewer] = useState(true);

	// Node Data State
  const [nodeName, setNodeName] = useState<string>('');
	const [nodeGroup, setNodeGroup] = useState<string>('');
	const [isNodeRemoving, setIsNodeRemoving] = useState(false);
	const [isLinkRemoving, setIsLinkRemoving] = useState(false);
	const [isLinking, setIsLinking] = useState(false);
	const [nodeToLink, setNodeToLink] = useState<NodeObject>(null);

	// Graph Options State
	const [enableFocusOnNode, setEnableFocusOnNode] = useState(false);
	const [enableNodeDrag, setEnableNodeDrag] = useState(true);
	const [enableShowLabels, setEnableShowLabels] = useState(true);
	const [enableShowLinks, setEnableShowLinks] = useState(true);
	const [enableShowDirected, setEnableShowDirected] = useState(true);

  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: []});

	const router = useRouter();

	if(isNodeRemoving){
		notification.info({
			key: 'remove-node-mode',
			message: 'Remove Node Mode',
			description: 'Click on node to remove',
			duration: 0,
		})
	} else{
		notification.destroy('remove-node-mode');
	}

	if(isLinkRemoving){
		notification.info({
			key: 'remove-link-mode',
			message: 'Remove Link Mode',
			description: 'Click on link to remove',
			duration: 0,
		})
	}	else{
		notification.destroy('remove-link-mode');
	}

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
	}

	const removeNode = (node) => {
		const updateNode = graphData.nodes.filter(item => item.id !== node.id);
		const updateLinks = graphData.links.filter((item : any) => item.target?.id !== node.id && item.source?.id !== node.id);

		const dataToUpdate = { ...graphData };
		dataToUpdate.nodes = updateNode;
		dataToUpdate.links = updateLinks;
		message.success('Removed node: ' + node.id + ' sucessfully');
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

  const showDrawer = (node) => {
		setModalNode(node);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

	const handleLinkClick = (link) => {
		if (isLinkRemoving) return removeLink(link);
	}

  const handleNodeClick = (node: NodeObject | any) => {
			if (isNodeRemoving){
				removeNode(node);
				return;
			}
      if(!isNodeRemoving && enableFocusOnNode && !isLinkRemoving && !isLinking){
				const distance = 80;
				const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
				if (fgRef.current) {
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
				notification.info({
					key: 'linking-mode',
					message: 'Linking Mode',
					description: 'Click on target node to link',
					duration: 0,
				})
				return;
			}
	
			else if (nodeToLink) {
				if (node === nodeToLink) {
					setNodeToLink(null);
					notification.destroy('linking-mode');
					return;
				}
	
				const newLink : LinkObject = { source: nodeToLink.id, target: node.id };
				const updateData : GraphData | any = { ...graphData };

				let isDuplicateLink = () => {
					let isDuplicate = false;
					updateData.links.forEach(link => {
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
			notification.destroy('linking-mode');
			return;
		}
		if (!isNodeRemoving && !isLinkRemoving && !isLinking) {
			setIsLinking(true);
			notification.destroy('linking-mode');
			notification.info({
				key: 'linking-mode',
				message: 'Linking Mode',
				description: 'Click on source node to link',
				duration: 0,
			})
		}
	}

	// firebase
	const [graphInfoFirebase, setGraphInfoFirebase] = useState<IGraphInfo>({
		title: 'Basic Graph Test',
		owner: 'test',
		graph: {
			nodes: [],
			links: [],
		},
		id: 'test',
		lastModified: new Date(),
	});

	// Check if user is viewer or editor
	useEffect(() => {
		if(!loggedInUser){
			setIsViewer(true);
		}else{
			if(loggedInUser.uid === graphInfoFirebase.owner){
				setIsViewer(false);
			}
		}
	},[loggedInUser, graphInfoFirebase])

	 const getGraphInfoFromFirebase = async () => {
		const graphInfoRef = doc(db,'graphs', graphID);
		const graphInfoSnap = await getDoc(graphInfoRef);
		if (graphInfoSnap.exists()) {
			setGraphInfoFirebase({
				title: graphInfoSnap.data().title,
				owner: graphInfoSnap.data().owner,
				graph: {
					nodes: graphInfoSnap.data().graph?.nodes,
					links: graphInfoSnap.data().graph?.links,
				},
				id: graphInfoSnap.data().id,
				lastModified: graphInfoSnap.data().lastModified,
			});
			setGraphData({
				nodes: graphInfoSnap.data().graph?.nodes,
				links: graphInfoSnap.data().graph?.links,
			} || {nodes:[],links:[]});
		} else {
			message.error('No such document!');
			router.push('/workspace');
		}
 	};
 
	 const updateGraph = async () => {
		const graphRef = doc(db,'graphs', graphID);
		const output = {
			graph: {
				links: graphData.links.map((link : any) => {
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
			},
			lastModified: serverTimestamp(),
		}

		await setDoc(graphRef, output, { merge: true });
		message.success('Graph updated!');
	}

	const confirm = (e: React.MouseEvent<HTMLElement>) => {
		removeNode(modalNode);
		onClose();
	};

	useEffect( () => {
			// getUserFromFirebase();
			getGraphInfoFromFirebase();
			
			// bloom effect
			const bloomPass = new UnrealBloomPass();
			bloomPass.strength = 1;
			bloomPass.radius = 1;
			bloomPass.threshold = 0.1;
			fgRef.current.postProcessingComposer().addPass(bloomPass);

	},[]);

	// graph effect
	const extraRenderers = [new CSS2DRenderer()];

  return (
		<>
			{/* <h1>{isViewer ? 'Viewer' : 'Editor'}</h1> */}
			<UIGraphController 
				graphInfoFirebase={graphInfoFirebase} 
				loggedInUser={loggedInUser} 
				updateGraph={updateGraph} 
				isViewer={isViewer}
			>
				<AsideOptions
					graphData={{
						nodeName, setNodeName,
						nodeGroup, setNodeGroup,
					}}
					dataOptions={{
						addNode,
						removeNode,
						isLinkRemoving, setIsLinkRemoving,
						isNodeRemoving, setIsNodeRemoving,
						isLinking, setIsLinking,
						activeLinking
					}}
					graphOptions={{
						enableFocusOnNode, setEnableFocusOnNode,
						enableNodeDrag, setEnableNodeDrag,
						enableShowLabels, setEnableShowLabels,
						enableShowLinks, setEnableShowLinks,
						enableShowDirected, setEnableShowDirected,
					}}
					isViewer={isViewer}
				/>
			</UIGraphController>
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
					<ShowNote 
						graphInfoFirebase={graphInfoFirebase} 
						modalNode={modalNode} 
						isViewer={isViewer}
						drawer={{
							open, onClose, confirm
						}}
						loggedInUser={loggedInUser}
					/>
				)
			}
		</>
  );
}