import { Button, Card, Col, message, Row, Space, Typography } from 'antd';
import React from 'react'
import { IQuestion } from '../../interfaces'
import {createAnswerToFirebase, deleteQuestionFromFirebase, getAnswerFromFirebase, updateAnswerToFirebase } from '../../utils/firebase';
import Editor from '../Editor';
import Question from './Question';

type Iprops = {
  questionList: IQuestion[];
  graphID: string;
  noteID: string;
  loggedInUser: any;
  setQuestionList: (questionList: IQuestion[]) => void;
}



function QuestionList({loggedInUser, questionList, setQuestionList, graphID, noteID} : Iprops) : JSX.Element {
  const handleGetAnswer = async (questionID) => {
    return getAnswerFromFirebase(graphID, questionID, loggedInUser.uid)
  }

  const handleUpdateAnswer = async (questionID, content) => {
    await updateAnswerToFirebase(graphID, questionID, loggedInUser.uid, content)
  }

  const handleDeleteQuestion = async (questionID) => {
    setQuestionList(questionList.filter((question) => question.questionID !== questionID))
    await deleteQuestionFromFirebase(graphID, questionID)
  }

  return (
      <div>
      <Row>
        {JSON.stringify(questionList)}
        {
          questionList.map((question, index) => {
            return (
                <Col span={16} offset={4}>
                  <Question
                    key={index}
                    question={question}
                    handleGetAnswer={handleGetAnswer}
                    handleUpdateAnswer={handleUpdateAnswer}
                    handleDeleteQuestion={handleDeleteQuestion}
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