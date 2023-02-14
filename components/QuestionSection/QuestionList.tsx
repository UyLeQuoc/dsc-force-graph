import { Col, Row } from 'antd';
import { IQuestion } from '../../interfaces';
import { deleteQuestionFromFirebase, getAnswerFromFirebase, updateAnswerToFirebase } from '../../utils/firebase';
import Question from './Question';

type Iprops = {
  graphID: string;
  noteID: string;
  loggedInUser: any;
  questionList: IQuestion[];
  setQuestionList: (questionList: IQuestion[]) => void;
  answerList: any;
  setAnswerList: (answerList: any) => void;
}

function QuestionList({loggedInUser, questionList, setQuestionList, graphID, noteID, answerList, setAnswerList} : Iprops) : JSX.Element {

  const handleUpdateAnswer = async (answerID, output) => {
    await updateAnswerToFirebase(answerID, output)
  }

  return (
      <div className='my-10'>
        <Row>
        {
          questionList.map((question, index) => {
            return (
                <Col span={16} offset={4} className="my-2">
                  <Question
                    key={index}
                    question={question}
                    handleUpdateAnswer={handleUpdateAnswer}
                    answerList={answerList}
                  />
                </Col>
            )
        })
      }
      </Row>
      </div>
  )
}

export default QuestionList