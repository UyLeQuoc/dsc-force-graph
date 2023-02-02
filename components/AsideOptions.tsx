import { Button, Divider, Input, Space, Typography } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import DataOptions from './DataOptions';
import GraphOptions from './GraphOptions';

type IProps = {
  graphData: {
    nodeName: string;
    setNodeName: Dispatch<SetStateAction<string>>;
    nodeGroup: string;
    setNodeGroup: Dispatch<SetStateAction<string>>;
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
  };
}

const AsideOptions = ({graphOptions, graphData, dataOptions}: IProps) => {
  // Node Data State
  const {nodeName, setNodeName, nodeGroup, setNodeGroup} = graphData;
  // Data Options State
  const {addNode} = dataOptions;

  return (
    <div>
        {/* <List>
          <List.Item
            actions={[<a onClick={() => signOut(auth)}>Sign Out</a>]}
          >
            <List.Item.Meta
              avatar={<Avatar src={loggedInUser?.photoURL} />}
              title={<h4>{loggedInUser?.displayName}</h4>}
              description={`logged in as ${loggedInUser?.email}`}
            />
          </List.Item>
        </List> */}
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
        <Divider orientation="left">Update Graph:</Divider>
    </div>
  );
};

export default AsideOptions;