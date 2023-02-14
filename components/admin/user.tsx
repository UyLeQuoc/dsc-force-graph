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
  DateField,
  EmailField,
  SimpleShowLayout
} from 'react-admin';

export const UserList = () => (
  <List>
      <Datagrid rowClick="show">
          <TextField source="id" />
          <ImageField source="photoURL" />
          <EmailField source="email" />
          <DateField source="lastSeen" />
      </Datagrid>
  </List>
);
export const UserShow = (props) => (
  <Show>
    <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
        <DateField source="lastSeen" />
        <ImageField source="photoURL" />
    </SimpleShowLayout>
    </Show>
);