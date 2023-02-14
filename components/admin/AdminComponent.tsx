import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import { FirebaseDataProvider } from "react-admin-firebase";
import { firebaseConfig } from "../../utils/firebase";
import { QuestionCreate, QuestionEdit, QuestionList, QuestionShow } from "./question";
import { AnswerCreate, AnswerEdit, AnswerList, AnswerShow } from "./answer";
import { UserList, UserShow } from "./user";

const options = {};
export const dataProvider = FirebaseDataProvider(firebaseConfig, options);

const AdminComponent = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={UserList} show={UserShow}/>
    <Resource name="Questions" list={QuestionList} show={QuestionShow} create={QuestionCreate} edit={QuestionEdit}/>
    <Resource name="Answers" list={AnswerList} show={AnswerShow} create={AnswerCreate} edit={AnswerEdit}/>
  </Admin>
);

export default AdminComponent;