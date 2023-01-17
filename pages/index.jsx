import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../utils/firebase'
import { signOut } from "firebase/auth";
import { useState } from "react";
import FocusGraphWrapper from "../components/FocusGraphWrapper";
import AsideOptions from "../components/AsideOptions";
import { Button } from 'antd';

export default function Index() {
	const [loggedInUser, _loading, _error] = useAuthState(auth);

	const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return <div className='overflow-hidden'>
    <div className='fixed z-10 bg-amber-200'>
      <h1>Focus Graph</h1>
      <div>Hi {loggedInUser?.displayName}!</div>
      <Button onClick={() => signOut(auth)}>Sign out</Button>
			{/* <button onClick={addNode}>Add</button>
			<button onClick={() => removeNode({id: 'Myriel', group: 1, color: '#a6cee3'})}>Remove</button> */}
			<Button type="primary" onClick={showDrawer}>
        Open
      </Button>
		</div>

    <FocusGraphWrapper optionsModal={{open, showDrawer, onClose}} loggedInUser={loggedInUser}/>
  </div>;
}