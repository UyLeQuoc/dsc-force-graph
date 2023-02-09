import { Button, Card, Col, message, Row, Space, Typography } from 'antd';
import React from 'react'
import { IQuestion } from '../../interfaces'
import {createAnswerToFirebase, getAnswerFromFirebase, updateAnswerToFirebase } from '../../utils/firebase';
import Editor from '../Editor';
import Question from './Question';

type Iprops = {
  questionList: IQuestion[];
  graphID: string;
  noteID: string;
  loggedInUser: any;
}



function QuestionList({loggedInUser, questionList, graphID, noteID} : Iprops) : JSX.Element {
  
  const handleCreateAnswer = (questionID) => {
    createAnswerToFirebase(graphID, questionID, loggedInUser.uid , {
      content: 'hi',
    })
    .then(() => {
      message.success('Answer created!')
    })
  }

  const handleGetAnswer = (questionID) => {
    getAnswerFromFirebase(graphID, questionID, loggedInUser.uid)
    .then((note) => {
      console.log(note)
      return note;
    })
  }

  const handleUpdateAnswer = async (questionID, content) => {
    updateAnswerToFirebase(graphID, questionID, loggedInUser.uid, content)
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
                    handleCreateAnswer={handleCreateAnswer}
                    handleUpdateAnswer={handleUpdateAnswer}
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