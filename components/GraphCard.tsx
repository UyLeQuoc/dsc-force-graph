import { Button, Card, Input, message, Modal, Popconfirm, Skeleton, Typography } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { convertDate, getCurrentDate } from '../utils/convert';

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
  const [lastmodifiedDay, setLastModifiedDay] = useState<string>(convertDate(lastModified));

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    handleRenameGraphTitle(id, graphTitle);
    setNewTitle(graphTitle)
    setOpen(false);
    setGraphTitle(graphTitle);
    setLastModifiedDay(getCurrentDate());
  };

  const handleCancel = () => {
    setOpen(false);
    setGraphTitle(newTitle);
  };

  const confirm = (e: React.MouseEvent<HTMLElement>) => {
    handleDeleteGraph(id)
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
          <div>Last Modified: {lastmodifiedDay}</div>
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