import { Button, Card, message, Typography, Image } from 'antd'
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
    handleGetAnswer(question.id)
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
      title={`Question: ${question.name}`} 
      extra={
        <>
          <Button type='primary' danger onClick={() => handleDeleteQuestion(question.id)}>Delete</Button>
        </>
    }>
      {question.picture != null && (
        <Image
          src={question.picture.src} alt={question.picture.title} />
      )}
      {
        answer &&  <Editor noteFirebase={answer} loading={false} updateNote={(content) => handleUpdateAnswer(question.questionID, content)} />
      }
    </Card>
  )
}

export default Question