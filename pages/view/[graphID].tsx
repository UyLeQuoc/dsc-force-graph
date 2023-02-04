import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../../utils/firebase'
import { useState } from "react";
import FocusGraphWrapper from "../../components/FocusGraphWrapper";
import { Button } from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons';
import { useRouter } from 'next/router';

export default function GraphID() : JSX.Element {
  const { query } = useRouter();
	const { graphID } = query;

	const [loggedInUser, _loading, _error] = useAuthState(auth);

	const [open, setOpen] = useState(false);

  const showDrawer = () : void => {
    setOpen(true);
  };

  const onClose = () : void => {
    setOpen(false);
  };

  return <div className='overflow-hidden'>
    <FocusGraphWrapper optionsModal={{open, showDrawer, onClose}} loggedInUser={loggedInUser} graphID={graphID}/>
  </div>;
}