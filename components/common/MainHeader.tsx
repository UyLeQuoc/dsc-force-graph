import { CarOutlined, HistoryOutlined, LogoutOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Col, ConfigProvider, Dropdown, Input, Row } from 'antd'

import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Logo from '../../public/logo/DSC-logo.svg'
import { auth } from '../../utils/firebase'

function MainHeader({show} : {show: boolean}) : JSX.Element {
  const [loggedInUser, loading, error] = useAuthState(auth);

  const router = useRouter();

  return (
    <div className={`fixed bg-white top-0 left-0 right-0 z-50 px-10 h-[64px]  main-header ${show ? 'main-header-show' : 'main-header-unshow'}`}>
      <Row align="middle" justify="space-between" className='leading-[64px]'>
        <Col flex="120px">
          <Link href='/' className='logo flex items-center'>
            <Image src={Logo} alt='logo' height={40} />
          </Link>
        </Col>
        <Col flex="auto">
          <Row align="middle" justify="space-between">
            <Col span={8}>
              <h3>Workspace</h3>
            </Col>
            <Col span={2}>
              <Dropdown menu={
                {
                  items: [
                    {
                      key: '1',
                      label: (
                        <div onClick={() => router.push("/workspace")}>
                          Workspace
                        </div>
                      ),
                      icon: <HistoryOutlined />,
                    },
                    {
                      key: '2',
                      label: (
                        <div onClick={() => router.push("/admin")}>
                          Admin
                        </div>
                      ),
                      icon: <UserOutlined />,
                    },
                    {
                      key: '3',
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
                <Avatar size="default" className='ml-5' src={loggedInUser != null ? loggedInUser.photoURL : <UserOutlined />}/>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default MainHeader