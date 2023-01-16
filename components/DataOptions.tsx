import { Checkbox } from 'antd';
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
		<h4> Data options: </h4>
		<Checkbox checked={isLinking} onChange={() => activeLinking()}>Links node</Checkbox>
		<Checkbox checked={isNodeRemoving} onChange={(e) => setIsNodeRemoving(e.target.checked)}>Remove Node</Checkbox>
		<Checkbox checked={isLinkRemoving} onChange={(e) => setIsLinkRemoving(e.target.checked)}>Remove Link</Checkbox>
	</>
}

export default DataOptions;