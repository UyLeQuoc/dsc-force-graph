import { Button, Card, Typography } from 'antd'
import {useEffect, useState} from 'react'
import Editor from '../Editor';

type IProps = {
  question: any;
  key: number;
  handleGetAnswer: (questionID: string) => any;
  handleCreateAnswer: (questionID: string) => void;
  handleUpdateAnswer: (questionID: string, content: string) => void;
}
function Question({question, handleGetAnswer, handleCreateAnswer, handleUpdateAnswer} : IProps) {
  const [answer, setAnswer] = useState<any>("")

  useEffect(() => {
    
      setAnswer(handleGetAnswer(question.questionID))
  
    return () => {
      setAnswer("")
    }
  }, [question.questionID])
  

  return (
    <Card size="small" title={`Asked by: ${question.owner}`} extra={<a href="#">More</a>}>
      <Typography.Title level={4}>Question: {question.question}</Typography.Title>
      <Typography.Paragraph>questionID: {question.questionID}</Typography.Paragraph>
      <Button type="primary" onClick={() => handleCreateAnswer(question.questionID)}>Create Note To Answer</Button>
      {
        answer &&  <Editor noteFirebase={answer} loading={false} updateNote={(content) => handleUpdateAnswer(question.questionID, content)} />
      }
    </Card>
  )
}

export default Question