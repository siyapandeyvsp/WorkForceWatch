"use client";

import React from 'react';
import { TextInput, Checkbox, Button, Group, Box, FileInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
const Signup = () => {
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      description: '',
      logo: '',
      cover: '',
      address: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  });

  const signupSubmit= (values) => {
    console.log(values);
    fetch('http://localhost:5000/company/add',{
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

        <TextInput
          withAsterisk
          label="Description"
          placeholder="Enter a description"
          {...form.getInputProps('description')}
        />

        <FileInput
          label="Logo"
          placeholder="Upload your logo"
          {...form.getInputProps('logo')}
        />

        <FileInput
          label="Cover"
          placeholder="Upload your cover image"
          {...form.getInputProps('cover')}
        />

        <TextInput
          label="Address"
          placeholder="Enter your address"
          {...form.getInputProps('address')}
        />

        <Checkbox
          mt="md"
          label="I agree to sell my privacy"
          {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default Signup;