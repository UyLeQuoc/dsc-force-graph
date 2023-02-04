import { Button, Modal, Tooltip, Typography } from 'antd';
import React, { useState } from 'react'
import { IGraphInfo } from '../../interfaces';

type IProps = {
  graphInfoFirebase: IGraphInfo
}

function InformationGraphModal({graphInfoFirebase}: IProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title="Graph Setting">
        <Button onClick={showModal} className="bg-white text-black hover:bg-green-400 group shadow-none border-none">
          <Typography.Text className="font-bold group-hover:text-green-700">{graphInfoFirebase.title}</Typography.Text>
        </Button>
      </Tooltip>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Typography.Title level={4}>Graph Information</Typography.Title>
        <Typography.Text>Graph ID: {graphInfoFirebase.id}</Typography.Text>
        <br />
        <Typography.Text>Graph Title: {graphInfoFirebase.title}</Typography.Text>
        <br />
        <Typography.Text>Graph Owner: {graphInfoFirebase.owner}</Typography.Text>
        <br />
        {/* <Typography.Text>Last Modified: {graphInfoFirebase.lastModified}</Typography.Text> */}
        

      </Modal>
    </>
  )
}

export default InformationGraphModal