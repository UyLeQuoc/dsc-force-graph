import React, { useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import Options from '../components/ForceGraphOptions';
import DataOptions from '../components/GraphDataOptions';
import AsideMenu from '../components/FocusGraph';

function App() {
	const [scope, setScope] = useState(0);
	const [graphData, setGraphData] = useState({ nodes: [], links: [] });
	const [randomGraphValue, setRandomGraphValue] = useState(null);
	const [visibileInput, setVisibleInput] = useState(false);

	const [enableZoom, setEnableZoom] = useState(false);
	const [moving, setMoving] = useState(false);
	const [nodeDrag, setNodeDrag] = useState(true);
	const [showLabels, setShowLabels] = useState(true);
	const [linkLabels, setLinkLabel] = useState(true);
	const [directed, setDirected] = useState(true);
	const [ticks, setTicks] = useState(100);

	const [nodeName, setNodeName] = useState('');
	const [nodeValue, setNodeValue] = useState('');
	const [nodeColor, setNodeColor] = useState('#2373AA');

	const [backupData, setBackupData] = useState({ nodes: [], links: [] });
	const [isRemoving, setIsRemoving] = useState(false);
	const [isLinkRemoving, setIsLinkRemoving] = useState(false);
	const [isLinking, setIsLinking] = useState(false);
	const [nodeToLink, setNodeToLink] = useState(null);
	const [linkName, setLinkName] = useState('');
	const [linkColor, setLinkColor] = useState('#888888');

	function genRandomTree(N = 10, reverse = false) {
		return {
			nodes: [...Array(N).keys()].map(i => ({ id: i, val: 1, name: `node${i}` })),
			links: [...Array(N).keys()]
				.filter(id => id)
				.map(id => ({
					[reverse ? 'target' : 'source']: id,
					[reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
					color: '#888888',
					name: `link${id}`
				}))
		};
	}

	function setNodesLabels(node, ctx, globalScale) {
		const label1 = `name: ${node.name}`
		const label2 = `id: ${node.id}`
		const fontSize = 13 / globalScale;
		ctx.font = `${fontSize}px Sans-Serif`;
		const textWidth = ctx.measureText(label1).width;
		const bckgDimensions = [textWidth, fontSize * 2].map(n => n + fontSize * 0.2);

		ctx.fillStyle = node === nodeToLink ? 'red' : '#222222';
		ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = node.color || '#2373AA';
		ctx.fillText(label1, node.x, node.y - 2);
		ctx.fillText(label2, node.x, node.y + 2);

		node.__bckgDimensions = bckgDimensions;
	}

	function setLinksLabels(link, ctx, globalScale) {
		if (!linkLabels) return
		const start = link.source;
		const end = link.target;

		// ignore unbound links
		if (typeof start !== 'object' || typeof end !== 'object') return;

		// calculate label positioning
		const textPos = Object.assign(...['x', 'y'].map(c => ({
			[c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
		})));

		const label = link.name || ''

		// estimate fontSize to fit in link length
		ctx.font = '1px Sans-Serif';
		const fontSize = 13 / globalScale;
		ctx.font = `${fontSize}px Sans-Serif`;
		const textWidth = ctx.measureText(label).width;
		const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

		// draw text label (with background rect)
		ctx.save();
		ctx.translate(textPos.x, textPos.y);

		ctx.fillStyle = 'transparent';
		ctx.fillRect(- bckgDimensions[0] / 2, - bckgDimensions[1] / 2, ...bckgDimensions);

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'white';
		ctx.fillText(label, 0, 0);
		ctx.restore();
	}

	function watchClickedNode(node, ctx) {
		ctx.beginPath();
		ctx.arc(node.x, node.y, 3 * node.val * 1.4, 0, 2 * Math.PI, false);
		if (node === nodeToLink) {
			ctx.arc(node.x, node.y, 4 * node.val * 1.4, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'red';
		}
		else ctx.fillStyle = node.color || '#2373AA';
		ctx.fill();
	}

	function newRamdomGraph() {
		setGraphData(randomGraphValue ? genRandomTree(parseInt(randomGraphValue)) : genRandomTree());
		setBackupData({ nodes: [], links: [] });
		setScope(1);
	}

	const addNode = () => {
		setTicks(1);
		const node = {
			id: graphData?.nodes?.length,
			val: nodeValue || 1,
			name: nodeName, color: nodeColor,
			fx: 0,
			fy: 40,
		};
		const newGraphData = { ...graphData };
		const nodesList = [...newGraphData.nodes] || [];
		nodesList.push(node);
		newGraphData.nodes = nodesList;

		setGraphData(newGraphData);
		setNodeName('');
		setNodeValue('');
		setNodeColor('#2373AA');

	}

	const activeRemoving = () => {
		setTicks(1);
		if (!isRemoving && !isLinkRemoving && !isLinking) {
			setIsRemoving(true);
			const backup = { ...graphData };
			setBackupData(backup);

			return toast('Select nodes to remove', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
		}
	}

	const inactiveRemoving = (cancel) => {
		if (cancel) setGraphData(backupData);
		setIsRemoving(false);
		setIsLinkRemoving(false);
		setIsLinking(false);
		setNodeToLink(null)
		toast.dismiss();
	}

	const removeNode = (node) => {
		const updateNode = graphData.nodes.filter(item => item.id !== node.id);
		const updateLinks = graphData.links.filter(item => item.target?.id !== node.id && item.source?.id !== node.id);

		const dataToUpdate = { ...graphData };
		dataToUpdate.nodes = updateNode;
		dataToUpdate.links = updateLinks;

		setGraphData(dataToUpdate);
	}

	const downloadFile = () => {
		// create file in browser
		const fileName = "graph";
		const json = JSON.stringify(graphData, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const href = URL.createObjectURL(blob);

		// create "a" HTLM element with href to file
		const link = document.createElement("a");
		link.href = href;
		link.download = fileName + ".json";
		document.body.appendChild(link);
		link.click();

		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	function handleAddFile(e) {
		e?.stopPropagation();
		e?.preventDefault();
		const fileReader = new FileReader();
		fileReader.onload = event => {
			const jsonObjt = JSON.parse(event.target.result);
			console.log(jsonObjt)
			let newNodes = [];
			jsonObjt.nodes?.forEach((node, index) => {
				newNodes.push({
					id: index,
					val: node.val || 1,
					name: node.name,
					color: node.color,
				})
			});

			let newLinks = [];
			jsonObjt.links?.forEach(link => {
				newLinks.push({
					source: link.source.id, target: link.target.id, color: link.color, name: link.name
				})
			})
			setGraphData({ nodes: newNodes, links: newLinks });
			setBackupData({ nodes: [], links: [] });
			setScope(1);
		}
		fileReader.onerror = error => {
			console.log(error);
			alert("Error to read file");
		}
		fileReader.readAsText(e.target.files?.item(0))

		e.target.value = null;
	}

	const handleNodeClick = (node) => {
		if (isRemoving) return removeNode(node);
		if (isLinking && !nodeToLink) {
			setNodeToLink(node);
			toast.dismiss('removing-node');
			return toast('Select targets', { toastId: 'select-targets', autoClose: false, closeButton: false, closeOnClick: false })
		}

		else if (nodeToLink) {
			if (node === nodeToLink) {
				setNodeToLink(null);
				toast.dismiss('select-targets');
				return toast('Select source node', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
			}

			const newLink = { source: nodeToLink, target: node, color: linkColor, name: linkName };
			const updateData = { ...graphData };
			if (!updateData.links.find(item => item === newLink)) {
				const updateLinks = [...updateData.links, newLink];
				const updateNode = [...updateData.nodes];
				updateData.links = updateLinks;
				updateData.nodes = updateNode;
				setGraphData(updateData);
			}
		}
	}

	const activeLinkRemoving = () => {
		setTicks(1);
		if (!isRemoving && !isLinkRemoving && !isLinking) {
			setIsLinkRemoving(true);
			const backup = { ...graphData };
			setBackupData(backup);

			return toast('Select links to remove', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
		}
	}

	const removeLink = (link) => {
		const updateLinks = graphData.links.filter(item => item !== link);

		const dataToUpdate = { ...graphData };
		dataToUpdate.links = updateLinks;

		setGraphData(dataToUpdate);
	}

	const activeLinking = () => {
		setTicks(1);
		if (!isRemoving && !isLinkRemoving && !isLinking) {
			setIsLinking(true);
			const backup = { ...graphData };
			setBackupData(backup);

			return toast('Select source node', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
		}
	}

	const handleLinkClick = (link) => {
		if (isLinkRemoving) return removeLink(link);
	}

	if (scope === 1) return (
		<>
			<div className="App">
				<header className="App-header">
					<ForceGraph2D
						graphData={graphData}
						linkWidth={2}
						enableZoomInteraction={enableZoom}
						enablePanInteraction={moving}
						enableNodeDrag={nodeDrag}
						height={900}
						nodeCanvasObject={showLabels ? setNodesLabels : watchClickedNode}
						nodeCanvasObjectMode={(node) =>
							node === nodeToLink && !showLabels
								? "before"
								: showLabels
									? "after"
									: undefined
						}
						onNodeClick={handleNodeClick}
						onLinkClick={handleLinkClick}
						cooldownTicks={ticks}
						onNodeDragEnd={node => {
							node.fx = node.x;
							node.fz = node.z;
						}}
						linkCanvasObject={setLinksLabels}
						linkCanvasObjectMode={() => 'after'}
						linkDirectionalArrowLength={directed ? 5 : undefined}
						linkDirectionalArrowRelPos={directed ? 2 : undefined}
						minZoom={4}
					/>

					<AsideMenu>
						<Options controls={{
							showLabels,
							setShowLabels,
							enableZoom,
							setEnableZoom,
							moving,
							setMoving,
							nodeDrag,
							setNodeDrag,
							linkLabels,
							setLinkLabel,
							directed,
							setDirected,
						}} />

						<DataOptions controls={{
							activeRemoving,
							inactiveRemoving,
							activeLinkRemoving,
							activeLinking,
							nodeName, setNodeName, nodeValue, setNodeValue, nodeColor, setNodeColor, addNode,
							nodeToLink, linkName, setLinkName, linkColor, setLinkColor,
						}} />

						<button onClick={() => { setScope(0); setTicks(100) }} > Go back </button>
						<button type="button" onClick={downloadFile}> Download JSON file </button>
					</AsideMenu>
				</header>
			</div>
			<ToastContainer />
		</>
	)

	else return (
		<div className="App">
			<header onMouseLeave={() => setVisibleInput(false)} className="App-header">
				<h3> react-force-graph tests </h3>
				<button onClick={() => setScope(1)} > Show options </button>
				<button
					onClick={newRamdomGraph}
					onMouseOver={() => setVisibleInput(true)}
				>
					New random force graph
				</button>
				{
					visibileInput &&
					<input
						value={randomGraphValue}
						onMouseOver={() => setVisibleInput(true)}
						onBlur={() => setVisibleInput(false)}
						placeholder='nodes number'
						type='number'
						onChange={(e) => setRandomGraphValue(e.target.value)} />
				}

				<label className='button-like' htmlFor='json-input'>
					Upload JSON file
				</label>
				<input
					id="json-input" type="file" accept={'application/json'}
					onChange={handleAddFile}
					style={{ display: "none" }}
				/>
			</header>
		</div>
	);
}

export default App;
