import { Button, Card, message, Typography, Image } from 'antd'
import {useEffect, useState} from 'react'
import { getAnswerFromFirebase } from '../../utils/firebase';
import Editor from '../Editor';

type IProps = {
  question: any;
  key: number;
  handleUpdateAnswer: (answerID: string, output: any) => Promise<void>;
  answerList: any;
}
function Question({question,   handleUpdateAnswer, answerList} : IProps) {
  const [answer, setAnswer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  console.log("22", answerList)
  const answerFilter = answerList.find((answer) => answer.questionID === question.questionID);

  return (
    <Card 
      title={`Question: ${question.name} - ${question.questionID}`} 
    >
      <div className='flex justify-center align-middle'>
        {question.picture != null && (
          <Image
            src={question.picture.src} alt={question.picture.title}
            width = {'50%'}
            />
        )}
      </div>
      {
        answer &&  <Editor noteFirebase={answerFilter?.content} loading={false} updateNote={(content) => handleUpdateAnswer(question.id, content)} />
      }
    </Card>
  )
}

export default Question