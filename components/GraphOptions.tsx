import { Checkbox } from 'antd';
import React from 'react';

const GraphOptions = ({ graphOptions }) => {
	console.log('graphOptions', graphOptions);

	const {
		enableFocusOnNode, setEnableFocusOnNode,
		enableNodeDrag, setEnableNodeDrag,
		enableShowLabels, setEnableShowLabels,
		enableShowLinks, setEnableShowLinks,
		enableShowDirected, setEnableShowDirected,
	} = graphOptions;

	return <>
		<h4> Layout options: </h4>
		<Checkbox checked={enableFocusOnNode} onChange={(e) => setEnableFocusOnNode(e.target.checked)}>enableFocusOnNode</Checkbox>
		<Checkbox checked={enableNodeDrag} onChange={(e) => setEnableNodeDrag(e.target.checked)}>enableNodeDrag</Checkbox>
		<Checkbox checked={enableShowLabels} onChange={(e) => setEnableShowLabels(e.target.checked)}>enableShowLabels</Checkbox>
		<Checkbox checked={enableShowLinks} onChange={(e) => setEnableShowLinks(e.target.checked)}>enableShowLinks</Checkbox>
		<Checkbox checked={enableShowDirected} onChange={(e) => setEnableShowDirected(e.target.checked)}>enableShowDirected</Checkbox>
	</>
}

export default GraphOptions;