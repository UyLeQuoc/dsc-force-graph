import { Checkbox, Divider, Space } from 'antd';
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
		<Divider orientation="left">Layout options:</Divider>
		<Space direction="vertical" className='w-full'>
			<Checkbox checked={enableFocusOnNode} onChange={(e) => setEnableFocusOnNode(e.target.checked)}>enableFocusOnNode</Checkbox>
			<Checkbox checked={enableNodeDrag} onChange={(e) => setEnableNodeDrag(e.target.checked)}>enableNodeDrag</Checkbox>
			<Checkbox checked={enableShowLabels} onChange={(e) => setEnableShowLabels(e.target.checked)}>enableShowLabels</Checkbox>
			<Checkbox checked={enableShowLinks} onChange={(e) => setEnableShowLinks(e.target.checked)}>enableShowLinks</Checkbox>
			<Checkbox checked={enableShowDirected} onChange={(e) => setEnableShowDirected(e.target.checked)}>enableShowDirected</Checkbox>
		</Space>
	</>
}

export default GraphOptions;