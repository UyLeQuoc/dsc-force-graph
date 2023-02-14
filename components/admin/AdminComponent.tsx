import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { FirebaseDataProvider } from "react-admin-firebase";
import { firebaseConfig } from "../../utils/firebase";
import { QuestionCreate, QuestionEdit, QuestionList, QuestionShow } from "./question";

const options = {};
export const dataProvider = FirebaseDataProvider(firebaseConfig, options);

const AdminComponent = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="Questions" list={QuestionList} show={QuestionShow} create={QuestionCreate} edit={QuestionEdit}/>
  </Admin>
);

export default AdminComponent;