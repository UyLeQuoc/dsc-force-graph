import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal } from 'antd';
import Upload, { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addQuestionToFirebase, getQuestionFromFirebase, multiImage } from '../../utils/firebase';

type IProps = {
  graphID: string;
  noteID: string;
  loggedInUser: any;
  questionList: any;
  setQuestionList: (questionList: any) => void;
}

function QuestionsModal({graphID, noteID, loggedInUser, questionList, setQuestionList} : IProps) : JSX.Element {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
  ]);

  const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleBeforeUpload = (file: RcFile) => {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error(`${file.name} is not a png file`);
    }
    return isPNG || Upload.LIST_IGNORE;
  }
  
  // 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<any>([]);
  const [questionInput, setQuestionInput] = useState<string>('');

  const showModal = () => {
    setIsModalOpen(true);
  };
	const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddQuestion = async () => {
    const questionID = uuidv4();
    multiImage(questionID, fileList)
    .then(async (res) => {
      const output = {
        questionID: questionID,
        question: questionInput,
        noteID: noteID,
        lastModified: Timestamp.now(),
        owner: loggedInUser.uid,
        images: res
      }
      console.log("photourl", res)
      await addQuestionToFirebase(graphID, output).then((res) => {
        setQuestionList([...questionList, output]);
        setQuestionInput('');
      })
    })
  }

  console.log(fileList);

  useEffect(() => {
    getQuestionFromFirebase(graphID,noteID).then((res) => {
      setQuestions(res)
    })
    return () => {
      setQuestions([])
    }
  }, [graphID, noteID])
  

  return (
    <>
      <Button type="primary" onClick={showModal}>View Question</Button>
      <Modal title="View Question" open={isModalOpen} onOk={handleOk} onCancel={handleModalCancel}>
      <Input value={questionInput} onChange={e => setQuestionInput(e.target.value)}/>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Button type='primary' onClick={handleAddQuestion}>Add Question</Button>
      </Modal>
    </>
)
}

export default QuestionsModal