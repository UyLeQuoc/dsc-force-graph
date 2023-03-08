import { Col, Divider, Row, Space, Typography } from 'antd';
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

import Image from 'next/image';
import Logo from '../../public/logo/DSC-logo.svg';
import Link from 'next/link';

function MainFooter() : JSX.Element {
  return (
    <div className='bg-white'>
      <Divider />
      <Row justify='space-between' align='top' className='px-[60px] pb-5' >
        <Col span={24} lg={8}>
          <Link href='/' className='logo'>
            <Image src={Logo} alt='logo' width={150} height={100} />
            <div className='title'>Developer Student Community</div>
          </Link>
          <div className='my-3'>
          "DSC Force Graph" is a website that displays information as a graph with interconnected nodes. It uses a force-directed graph layout to arrange the nodes, making it visually appealing and easy to navigate.
          </div>
        </Col>
        <Col span={6}>
          <Space direction='vertical' size='middle'>
            <Typography.Text className='font-bold text-xl'>INFORMATION</Typography.Text>
            <Typography>Về DSC</Typography>
            <Typography>Trợ giúp</Typography>
          </Space>
        </Col>
        <Col span={6} >
          <Space direction='vertical' size='middle'>
            <Typography.Text className='font-bold text-xl'>CONTACT</Typography.Text>
            <Typography><FacebookOutlined className='mr-2' />Facebook</Typography>
            <Typography><InstagramOutlined className='mr-2' />Instagram</Typography>
            <Typography><YoutubeOutlined className='mr-2' />Youtube</Typography>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={24} className='text-center bg-[#002333] text-white p-6'>
          <div>Copyright 	&copy; 2023 Developer Student Community Co., Ltd. All Right Reserved</div>
        </Col>
      </Row>
    </div>
  )
}

export default MainFooter