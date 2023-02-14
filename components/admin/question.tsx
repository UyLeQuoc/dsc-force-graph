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
  ImageInput
} from 'react-admin';
import MyImageField from './MyImageField';

export const QuestionShow = (props) => (
  <Show {...props}>
      <Datagrid>
        <TextField source='name' label="Question"/>
        <TextField source='noteID' label="URL Note ID" />
        <ImageField source="picture" title="title" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
  </Show>
);
export const QuestionList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='name' label="Question"/>
        <TextField source='noteID' label="URL Note ID" />
        <MyImageField source="picture" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  )
};
export const QuestionCreate = (props) => (
  <Create {...props} >
    <SimpleForm>
        <TextInput source='name' label="Question" multiline/>
        <TextInput source='noteID' label="URL Note ID"/>
        <ImageInput source="picture" label="Question-Pic" accept="image/*">
          <ImageField source="Question-Pic" title="title" />
        </ImageInput>
    </SimpleForm>
  </Create>
);

export const QuestionEdit = (props) => (
  <Edit>
    <SimpleForm>
        <TextInput source="noteID" />
        <ImageInput source="picture" label="Question-Pic" accept="image/*">
          <ImageField source="Question-Pic" title="title" />
        </ImageInput>
        <TextInput source="name" label="Question"/>
    </SimpleForm>
    </Edit>
);
