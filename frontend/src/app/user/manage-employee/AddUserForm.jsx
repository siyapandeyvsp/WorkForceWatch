"use client";

import React from 'react';
import { TextInput, Checkbox, Button, Group, Box, FileInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
const AddUserForm = () => {
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      avatar: '',
    designation: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  });

  const signupSubmit= (values) => {
    console.log(values);
    fetch('http://localhost:5000/employee/add',{
      method:'POST',
      body:JSON.stringify(values),
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then((res) => {
      console.log(res.status);
      if(res.status===200){
        notifications.show({ title: 'Success', message: 'User registered successfully' });
      }else{
        notifications.show({ title: 'Error', message: 'Failed to register user' });
      }
      
    }).catch((err) => {
      console.log(err);
      notifications.show({ title: 'Error', message: 'Failed to register user' });
    });
  }
  

  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit(signupSubmit)}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

<TextInput
          withAsterisk
          label="Name"
          placeholder="Enter your name"
          {...form.getInputProps('name')}
        />

<PasswordInput
label="Password"
placeholder="Enter your password"
{...form.getInputProps('password')}
/>

<TextInput
          label="Avatar"
          placeholder="Upload Avatar"
          {...form.getInputProps('avatar')}
        />
        <TextInput
          withAsterisk
          label="Designation"
          placeholder="Designation"
          {...form.getInputProps('designation')}
        />

       

       

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default AddUserForm;