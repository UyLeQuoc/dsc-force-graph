import { useCallback, useRef, useState } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import { Drawer, message, Modal, Space } from "antd";
import { GraphData, NodeObject } from "react-force-graph-2d";

import {gData} from "../datasets/data";
import AsideOptions from "./AsideOptions";
import GraphOptions from "./GraphOptions";
import { ILink } from "../interfaces";

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

export default function BasicNodeChart({optionsModal} : any) {
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
	const [enableFocusOnNode, setEnableFocusOnNode] = useState(true);
	const [enableNodeDrag, setEnableNodeDrag] = useState(true);
	const [enableShowLabels, setEnableShowLabels] = useState(true);
	const [enableShowLinks, setEnableShowLinks] = useState(true);
	const [enableShowDirected, setEnableShowDirected] = useState(true);

  const [graphData, setGraphData] = useState(
		{ 
			nodes: [
			{
				"id": "Myriel",
				"group": 1
			},
			{
					"id": "Napoleon",
					"group": 1
			},
			{
					"id": "Mlle.Baptistine",
					"group": 2
			},
			{
				"id": "Mireel",
				"group": 3
		},
		], 
		links: [
		{
				"source": "Napoleon",
				"target": "Myriel"
		},
		{
				"source": "Myriel",
				"target": "Mlle.Baptistine"
		},
		{
				"source": "Mlle.Baptistine",
				"target": "Napoleon"
		},
		{
				"source": "Mireel",
				"target": "Napoleon"
		}
	]}
	);



	console.log('graph-data', graphData);

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

  return (
		<div className="">
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
				ref={fgRef}
				graphData={graphData}
				nodeLabel="id"
				nodeAutoColorBy="group"
				onNodeClick={handleNodeClick}
				onLinkClick={handleLinkClick}
				backgroundColor="#404040"
				
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
						title="Basic Drawer"
						placement={"right"}
						closable={false}
						onClose={onClose}
						open={open}
					>
						<Space direction="vertical">
							<p>ID: {modalNode.id}</p>
							<p>Group: {modalNode.group}</p>
							<p>Color: {modalNode.color}</p>
							<p>Index: {modalNode.index}</p>
							<p>x: {modalNode.x}, y: {modalNode.y}. z: {modalNode.z}</p>
							<p>vx: {modalNode.vx}, vy: {modalNode.vy}. vz: {modalNode.vz}</p>
							<button onClick={() => {
								removeNode(modalNode);
								onClose();
							}}>Delete</button>
						</Space>

					</Drawer>
				)
			}
		</div>
  );
}