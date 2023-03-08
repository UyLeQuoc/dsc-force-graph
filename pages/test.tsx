import { Button, message } from 'antd';
import { signOut } from 'firebase/auth';
import { useRef } from 'react';
import { auth, uploadImage } from '../utils/firebase';
import { useContext } from 'react';
import AuthContext from '../auth/AuthProvider';
function test() {
  const inputRef = useRef<HTMLInputElement>(null);
  const authProvider = useContext(AuthContext);

  const handleUpload = () => {
    const file = inputRef.current.files[0];
    console.log(file);
    uploadImage(file)
    .then((url) => {
      message.success('Upload Successfully!' + url);
    })
  }
  
  return (
    <>
      <h1>{authProvider.role}</h1>
      <h1>{JSON.stringify(auth)}</h1>
      <Button onClick={() => signOut(auth)}>Sign out</Button>
        {/* upload component */}
        <input type="file" ref={inputRef}/>
        <button type="button" onClick={handleUpload}>Upload</button>
    </>
  )
}

export default test