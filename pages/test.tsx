import { message } from 'antd';
import React from 'react'
import { uploadImage } from '../utils/firebase';

function test() {
  const inputRef = React.useRef<HTMLInputElement>(null);

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
      {/* upload component */}
      <input type="file" ref={inputRef}/>
      <button type="button" onClick={handleUpload}>Upload</button>
    </>
  )
}

export default test