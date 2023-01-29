import { Dispatch, SetStateAction, useState } from 'react';
import { Avatar, Button, Divider, Drawer, Input, List, Radio, Space, Typography } from 'antd';
import GraphOptions from './GraphOptions';
import DataOptions from './DataOptions';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

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
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  // Node Data State
  const {nodeName, setNodeName, nodeGroup, setNodeGroup, nodeValue, setNodeValue} = graphData;
  // Data Options State
  const {addNode, removeNode, isLinkRemoving, setIsLinkRemoving, isNodeRemoving, setIsNodeRemoving, activeLinking, updateGraph} = dataOptions;
  const {open, onClose} = optionsModal;


  return (
    <>
      <Drawer
        title={`(LogoDSC) DSC Focus Graph`}
        placement={"left"}
        closable={false}
        onClose={onClose}
        open={open}
        footer={
          <Button type='primary' onClick={() => {updateGraph()}}>Update Graph</Button> 
        }
      >
        <List>
          <List.Item
            actions={[<a onClick={() => signOut(auth)}>Sign Out</a>]}
          >
            <List.Item.Meta
              avatar={<Avatar src={loggedInUser?.photoURL} />}
              title={<h4>{loggedInUser?.displayName}</h4>}
              description={`logged in as ${loggedInUser?.email}`}
            />
          </List.Item>
        </List>
        
        <Divider orientation="left">Create Node:</Divider>
        <Space direction="vertical">
          <Typography.Text>Node Name</Typography.Text>
          <Input placeholder="Node Name" value={nodeName} onChange={(e) => setNodeName(e.target.value)}/>
          <Typography.Text>Node Group</Typography.Text>
          <Input placeholder="Node Group" value={nodeGroup} onChange={(e) => setNodeGroup(e.target.value)}/>
          <Button type="primary" onClick={addNode}>Create</Button>
        </Space>

        <GraphOptions
          graphOptions = {graphOptions}
        />
        <DataOptions
          dataOptions = {dataOptions}
        />
      </Drawer>
    </>
  );
};

export default AsideOptions;