import { Avatar, Button, Card, Input, List, message, Modal, Popconfirm, Skeleton, Space, Typography } from 'antd';
import {SettingOutlined, EditOutlined, EllipsisOutlined} from '@ant-design/icons';
import { useState } from 'react';
import Link from 'next/link';

type IProps = {
  id: string;
  title: string;
  owner: string;
  lastModified: any;
  handleRenameGraphTitle: (id: string, title: string) => void;
  handleDeleteGraph: (id: string) => void;
}
function GraphCard({id, title, owner, lastModified, handleRenameGraphTitle, handleDeleteGraph}:IProps) : JSX.Element {
  const [loading, setLoading] = useState(false);
  const [graphTitle, setGraphTitle] = useState<string>(title);
  const [newTitle, setNewTitle] = useState<string>(title);

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    handleRenameGraphTitle(id, graphTitle);
    setNewTitle(graphTitle)
    setOpen(false);
    setGraphTitle(graphTitle);
  };

  const handleCancel = () => {
    setOpen(false);
    setGraphTitle(newTitle);
  };

  const confirm = (e: React.MouseEvent<HTMLElement>) => {
    handleDeleteGraph(id)
    console.log(e);
    message.success('Click on Yes');
  };
  
  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error('Click on No');
  };


  return (
    <>
      <Card 
        size="small" title={`${newTitle}`} extra={<Link href={`/edit/${id}`} 
        rel="noopener noreferrer" target="_blank">View</Link>} style={{ width: 300 }}
        actions={[
          <Button onClick={showModal}>Rename</Button>,
          <Popconfirm
            title="Delete the graph?"
            description="Are you sure to delete this graph?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type='primary' danger>Delete</Button>
          </Popconfirm>,
        ]}
      >
        <Skeleton loading={loading} active>
          <div>ID: {id}</div>
          <div>Owner: {owner}</div>
          <div>Last Modified: {lastModified?.toDate() && new Date(lastModified.toDate()).toUTCString()}</div>
        </Skeleton>
      </Card>
      <Modal
        title={"Rename Graph"}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography.Text>Enter a new graph name:</Typography.Text>
        <Input placeholder="New Graph Name" value={graphTitle} onChange={(e) => setGraphTitle(e.target.value)}/>
      </Modal>
    </>
  )
}

export default GraphCard