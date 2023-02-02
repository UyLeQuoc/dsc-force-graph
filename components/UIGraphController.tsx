import { Avatar, Button, Divider, Dropdown, MenuProps, Space, Typography } from 'antd'
import React from 'react'
import styles from '../styles/UIGraphController.module.css'
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
type IProps = {
  graphInfoFirebase: any;
  children: React.ReactNode;
  loggedInUser: any;
  updateGraph: () => void;
}

function UIGraphController({graphInfoFirebase, children, loggedInUser, updateGraph} : IProps) : JSX.Element{
  const [isOpened, setIsOpened] = React.useState<boolean>(true)
  function handleOpen() {
    setIsOpened(!isOpened)
  }

  return (
    <>
      <div className={styles.controller_main}>
        <Typography.Text>DSC Logo</Typography.Text>
        <Divider type='vertical'/>
        <Typography.Text>{graphInfoFirebase.title}</Typography.Text>
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
            <Avatar size="default" src={loggedInUser.photoURL}/>
          </Space>
        </Dropdown>
        <Divider type='vertical'/>
        <Button type='primary' onClick={updateGraph}>Save Graph</Button>
        <Divider type='vertical'/>
        <Button type='primary'>Share</Button>
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