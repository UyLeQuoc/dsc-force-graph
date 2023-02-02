import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../utils/firebase'
import { signOut } from "firebase/auth";
import { useState } from "react";
import FocusGraphWrapper from "../components/FocusGraphWrapper";
import { Button } from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons';

export default function Index() : JSX.Element {
	const [loggedInUser, _loading, _error] = useAuthState(auth);

  return <div className='overflow-hidden'>
    <FocusGraphWrapper loggedInUser={loggedInUser}/>
  </div>;
}