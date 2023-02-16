import { Button, Card, message, Typography, Image } from 'antd'
import {useEffect, useState} from 'react'
import { createAnswer, getAnswerFromFirebase, updateAnswer } from '../../utils/firebase';
import Editor from '../Editor';

type IProps = {
  question: any;
  key: number;
  answer: any;
  loggedInUser: any;
}
function Question({question, answer, loggedInUser} : IProps) {
  console.log('answer', answer)
  const [answerUI, setAnswerUI] = useState<any>(undefined);

  const handleCreateAnswer = async () => {
    createAnswer(question.id, loggedInUser.email)
    .then((res) => {
      setAnswerUI(res);
    })
  }
  useEffect( () => {
    setAnswerUI(answer);
    return () => {
      setAnswerUI(undefined);
    }
},[]);

  return (
    <>
      <div className='flex justify-center align-middle'>
        {question.picture != null && (
          <>
            <h3>{`Question: ${question.name}`}</h3>
            <Image
              src={question.picture.src} alt={question.picture.title}
              width = "200px"
              height = "200px"
              />
          </>
        )}
      </div>
      {
        answerUI ? (
          <Editor noteFirebase={answerUI} loading={false} updateNote={(content) => updateAnswer(answerUI.id, content)} />
        ) : (
          <Button type='primary' onClick={handleCreateAnswer}>Create Answer</Button>
        )
      }
    </>
  )
}

export default Question