import React from 'react';
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  EditButton,
  DeleteButton,
  ImageField,
  ImageInput,
  ReferenceField
} from 'react-admin';

export const AnswerShow = (props) => (
  <Show {...props}>
      <Datagrid>
        <TextField source='id' label="ID" />
        <ReferenceField source="questionID" reference="Questions" />
        <TextField source='name' label="User" />
        <TextField source='content' label="Answer" />
        <ImageField source="Question-Pic.src" title="title" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
  </Show>
);
export const AnswerList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' label="ID" />
        <ReferenceField source="questionID" reference="Questions" />
        <TextField source='name' label="User" />
        <TextField source='content' label="Answer" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  )
};
export const AnswerCreate = (props) => (
  <Create {...props} >
    <SimpleForm>
        <TextInput source='name' label="Question" multiline/>
        <TextInput source='noteID' label="URL Note ID" />
        <TextInput source='questionID' label="Question ID" />
        <TextInput source='user' label="User Name" />
        <TextInput source='content' label="Answer" multiline/>
    </SimpleForm>
  </Create>
);

export const AnswerEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
        <TextInput source='name' label="Answer" multiline/>
        <TextInput source='noteID' label="URL Note ID" />
        <TextInput source='questionID' label="Question ID" />
        <TextInput source='user' label="User Name" />
        <TextInput source='content' label="Answer" multiline/>
    </SimpleForm>
  </Edit>
);
