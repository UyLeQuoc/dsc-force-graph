import {useEffect, useState} from "react";
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import { FirebaseDataProvider } from "react-admin-firebase";
import { auth, firebaseConfig, getUserFromFirebase } from "../../utils/firebase";
import { QuestionCreate, QuestionEdit, QuestionList, QuestionShow } from "./question";
import { AnswerCreate, AnswerEdit, AnswerList, AnswerShow } from "./answer";
import { UserList, UserShow } from "./user";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

const options = {};
export const dataProvider = FirebaseDataProvider(firebaseConfig, options);

const AdminComponent = () => {
  const [loggedInUser] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    getUserFromFirebase(loggedInUser)
    .then((res) => {
      if(!res.isAdmin){
        router.back();
      }
    })
  
  }, [])

  return (  
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={UserList} show={UserShow} edit={EditGuesser}/>
      <Resource name="Notes" list={ListGuesser} show={ShowGuesser}/>
      <Resource name="Questions" list={QuestionList} show={QuestionShow} create={QuestionCreate} edit={QuestionEdit}/>
      <Resource name="Answers" list={AnswerList} show={AnswerShow} create={AnswerCreate} edit={AnswerEdit}/>
    </Admin>
  );

}

export default AdminComponent;