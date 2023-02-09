import { Button, Input, Modal } from 'antd';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { addQuestionToFirebase, getQuestionFromFirebase } from '../../utils/firebase';

type IProps = {
  graphID: string;
  noteID: string;
  loggedInUser: any;
}

function QuestionsModal({graphID, noteID, loggedInUser} : IProps) : JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<any>([]);
  const [questionInput, setQuestionInput] = useState<string>('');

  const showModal = () => {
    setIsModalOpen(true);
  };
	const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddQuestion = () => {
    const output = {
      question: questionInput,
      noteID: noteID,
      lastModified: Timestamp.now(),
      owner: loggedInUser.uid
    }
    addQuestionToFirebase(graphID, noteID, output).then((res) => {
      setQuestions([...questions, output]);
      setQuestionInput('');
    })
  }

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
      <Modal title="View Question" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {JSON.stringify(questions)}
        <Input value={questionInput} onChange={e => setQuestionInput(e.target.value)}/>
        <Button type='primary' onClick={handleAddQuestion}>Add Question</Button>
      </Modal>
    </>
)
}

export default QuestionsModal