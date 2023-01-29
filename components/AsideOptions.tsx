import { Dispatch, SetStateAction, useState } from 'react';
import { Button, Drawer, Radio, Space } from 'antd';
import GraphOptions from './GraphOptions';
import DataOptions from './DataOptions';

type IProps = {
  graphData: {
    nodeName: string;
    setNodeName: Dispatch<SetStateAction<string>>;
    nodeGroup: string;
    setNodeGroup: Dispatch<SetStateAction<string>>;
    nodeValue: number;
    setNodeValue: Dispatch<SetStateAction<number>>;
  };
  graphOptions: {
    enableFocusOnNode: boolean;
    setEnableFocusOnNode: Dispatch<SetStateAction<boolean>>;
    enableNodeDrag: boolean;
    setEnableNodeDrag: Dispatch<SetStateAction<boolean>>;
    enableShowLabels: boolean;
    setEnableShowLabels: Dispatch<SetStateAction<boolean>>;
    enableShowLinks: boolean;
    setEnableShowLinks: Dispatch<SetStateAction<boolean>>;
    enableShowDirected: boolean;
    setEnableShowDirected: Dispatch<SetStateAction<boolean>>;
  };
  dataOptions: {
    addNode: () => void;
    removeNode: (node) => void;
    isLinkRemoving: boolean; setIsLinkRemoving: Dispatch<SetStateAction<boolean>>;
    isNodeRemoving: boolean; setIsNodeRemoving: Dispatch<SetStateAction<boolean>>;
    isLinking: boolean; setIsLinking: Dispatch<SetStateAction<boolean>>;
    activeLinking: () => void;
    updateGraph: () => void;
  };
  optionsModal: {
    open: boolean;
    onClose: () => void;
  }
}

const AsideOptions = ({graphOptions, graphData, dataOptions, optionsModal}: IProps) => {

  // Node Data State
  const {nodeName, setNodeName, nodeGroup, setNodeGroup, nodeValue, setNodeValue} = graphData;
  // Data Options State
  const {addNode, removeNode, isLinkRemoving, setIsLinkRemoving, isNodeRemoving, setIsNodeRemoving, activeLinking, updateGraph} = dataOptions;
  const {open, onClose} = optionsModal;


  return (
    <>
      <Drawer
        title="Basic Drawer"
        placement={"left"}
        closable={false}
        onClose={onClose}
        open={open}
      >
        <GraphOptions
          graphOptions = {graphOptions}
        />
        <DataOptions
          dataOptions = {dataOptions}
        />

        <h3>New Node</h3>
        <Space direction="vertical">
          <input type="text" placeholder="Node Name" value={nodeName} onChange={(e) => setNodeName(e.target.value)}/>
          <input type="text" placeholder="Node Group" value={nodeGroup} onChange={(e) => setNodeGroup(e.target.value)}/>  
          
          <Button type="primary" onClick={addNode}>Add</Button>
          <Button onClick={() => {updateGraph()}}>Update Graph</Button> 
        </Space>

        
      </Drawer>
    </>
  );
};

export default AsideOptions;