import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../utils/firebase'
import { signOut } from "firebase/auth";
import { useState } from "react";
import FocusGraphWrapper from "../components/FocusGraphWrapper";
import { Button } from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons';

export default function Index() : JSX.Element {
	const [loggedInUser, _loading, _error] = useAuthState(auth);

	const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return <div className='overflow-hidden'>
    <div className='fixed z-10 p-6'>
			<Button type="primary" onClick={showDrawer}>
        {open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
		</div>

    <FocusGraphWrapper optionsModal={{open, showDrawer, onClose}} loggedInUser={loggedInUser}/>
  </div>;
}