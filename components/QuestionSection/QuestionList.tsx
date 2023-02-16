import { Col, Row } from 'antd';
import { IQuestion } from '../../interfaces';
import Question from './Question';

type Iprops = {
  noteID: string;
  loggedInUser: any;
  questionList: any;
  setQuestionList: (questionList: any) => void;
  answerList: any;
  setAnswerList: (answerList: any) => void;
}

function QuestionList({loggedInUser, questionList, setQuestionList,  noteID, answerList, setAnswerList} : Iprops) : JSX.Element {
  if(!answerList) return <></>
  return (
        <>
          {
              questionList.map((question, index) => {
                return (
                    <Col span={20} offset={2} className="my-2">
                      <Question
                        key={index}
                        question={question}
                        answer={answerList.get(question.id)}
                        loggedInUser={loggedInUser}
                      />
                    </Col>
                )
            })
          }
        </>
  )
}

export default QuestionList