import { Checkbox, Divider, Space } from 'antd';
import React from 'react';

const DataOptions = ({ dataOptions }) => {
	console.log('DataOptions', dataOptions);

	const {
		isLinkRemoving, setIsLinkRemoving,
		isNodeRemoving, setIsNodeRemoving,
		isLinking, setIsLinking,
		activeLinking,
	} = dataOptions;
	
	return <>
		<Divider orientation="left">Data options:</Divider>
		<Space direction="vertical">
			<Checkbox checked={isLinking} onChange={() => activeLinking()}>Links node</Checkbox>
			<Checkbox checked={isNodeRemoving} onChange={(e) => setIsNodeRemoving(e.target.checked)}>Remove Node</Checkbox>
			<Checkbox checked={isLinkRemoving} onChange={(e) => setIsLinkRemoving(e.target.checked)}>Remove Link</Checkbox>
		</Space>
	</>
}

export default DataOptions;