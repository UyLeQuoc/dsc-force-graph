import { Button, Divider, Typography } from 'antd'
import React from 'react'
import styles from '../styles/UIGraphController.module.css'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

function UIGraphController({graphInfoFirebase, children} : any) : JSX.Element{
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
        <Typography.Text>{graphInfoFirebase.owner}</Typography.Text>
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