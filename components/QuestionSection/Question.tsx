import { Button, Card, message, Typography } from 'antd'
import Image from 'next/image';
import {useEffect, useState} from 'react'
import { getAnswerFromFirebase } from '../../utils/firebase';
import Editor from '../Editor';

type IProps = {
  question: any;
  key: number;
  handleGetAnswer: (questionID: string) => Promise<any>;
  handleUpdateAnswer: (questionID: string, content: string) => void;
  handleDeleteQuestion: (questionID: string) => void;
}
function Question({question, handleGetAnswer,  handleUpdateAnswer, handleDeleteQuestion} : IProps) {
  const [answer, setAnswer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    handleGetAnswer(question.questionID)
      .then((answer) => {
        setAnswer(answer)
        setIsLoading(false)
      })
      
  
    return () => {
      setIsLoading(true)
    }
  }, [question.questionID])
  

  return (
    <Card 
      title={`Question: ${question.question}`} 
      extra={
        <>
          <Button type='primary' danger onClick={() => handleDeleteQuestion(question.questionID)}>Delete</Button>
        </>
    }>
      {
        question.images && question.images.map((image, index) => {
          return (
            <Image key={index} src={image} alt="Question Image" width={300} height={300}/>
          )
        })
      }
      {
        answer &&  <Editor noteFirebase={answer} loading={false} updateNote={(content) => handleUpdateAnswer(question.questionID, content)} />
      }
    </Card>
  )
}

export default Question