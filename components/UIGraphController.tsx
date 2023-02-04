import { Avatar, Button, Divider, Dropdown, MenuProps, Space, Typography } from 'antd'
import React from 'react'
import styles from '../styles/UIGraphController.module.css'
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import InformationGraphModal from './ControllerModal/InformationGraphModal';
import ShareGraphModal from './ControllerModal/ShareGraphModal';
import Link from 'next/link';
import LogoIcon from '../public/logo/DSC_LOGO.png'

type IProps = {
  graphInfoFirebase: any;
  children: React.ReactNode;
  loggedInUser: any;
  updateGraph: () => void;
  isViewer: boolean;
}

function UIGraphController({graphInfoFirebase, children, loggedInUser, updateGraph, isViewer} : IProps) : JSX.Element{
  const [isOpened, setIsOpened] = React.useState<boolean>(true)
  function handleOpen() {
    setIsOpened(!isOpened)
  }

  return (
    <>
      <div className={styles.controller_main}>
          {/* <Image
            src={LogoIcon} alt="DSC FPTU"
      
          /> */}
          <Link href="/workspace">DSC FPTU</Link>
        <Divider type='vertical'/>
          <InformationGraphModal graphInfoFirebase={graphInfoFirebase} />
        <Divider type='vertical'/>
        <Dropdown menu={
          {
            items: [
              {
                key: '1',
                label: (
                  <div onClick={() => signOut(auth)}>
                    Log out
                  </div>
                ),
                icon: <LogoutOutlined />,
              },
            ]
          }
        }>
          <Space>
            <Avatar size="default" src={loggedInUser != null ? loggedInUser.photoURL : "DSC"}/>
          </Space>
        </Dropdown>
        {
          isViewer ? null : (
            <>
              <Divider type='vertical'/>
              <Button type='primary' onClick={updateGraph}>Save Graph</Button>
            </>
          )
        }
        
        <Divider type='vertical'/>
        <ShareGraphModal graphInfoFirebase={graphInfoFirebase} />
      </div>
      
      <div className={styles.controller}>
        <div className={isOpened ? styles.controller_graphs_open : styles.controller_graphs}>
          <div className={styles.controller_graphs_children}>
            {children}
          </div>
        </div>
        <Button onClick={handleOpen} className={isOpened ? styles.controller_toggle_open : styles.controller_toggle}>
          {isOpened ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
    </>
  )
}

export default UIGraphController