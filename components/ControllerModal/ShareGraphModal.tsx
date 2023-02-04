import { CopyOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Tooltip, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IGraphInfo } from '../../interfaces';

type IProps = {
  graphInfoFirebase: IGraphInfo
}

function InformationGraphModal({graphInfoFirebase}: IProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { asPath } = useRouter();
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    const URL = `${origin}`;


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(URL+"/view/"+graphInfoFirebase.id);
    message.success("Link copied to clipboard");
  }

  return (
    <>
      <Tooltip title="Share with everyone">
        <Button onClick={showModal} type="primary">
          <Typography.Text className=" text-white">Share</Typography.Text>
        </Button>
      </Tooltip>
      <Modal title={"Share with everyone"} open={isModalOpen} onCancel={handleCancel} footer={
        <Button type="primary" icon={<CopyOutlined />} onClick={handleCopyLink}>
          Copy Link
        </Button>
      }>
        <Input
          placeholder="Share with everyone"
          value={URL+"/view/"+graphInfoFirebase.id}
          className="w-full"
        />
      </Modal>
    </>
  )
}

export default InformationGraphModal