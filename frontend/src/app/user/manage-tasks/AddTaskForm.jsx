"use client";
import React, { useState } from 'react';
import { TextInput, Textarea, Select, Button, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const AddTaskForm = ({ employeeId = '',assigned=false }) => {
  const [tasks, setTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem('user'))
    );

    const fetchTasks = async () => {
      const response = await axios.get("http://localhost:5000/task/getall");
      console.log(response.data)
      setTasks(response.data);
    };

  const form = useForm({
    initialValues: {
      taskName: '',
      description: '',
      priority: '',
      status: '',
      assignedTo:employeeId,
      assigned:assigned
     
    },

    validationRules: {
      taskName: (value) => value.trim().length > 0,
    },
  });

  const taskSubmit = (values) => {
    console.log(values);
    axios.post('http://localhost:5000/task/add', values, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': currentUser.token,
      }
    })
    .then((res) => {
      console.log(res.status);
      if(res.status === 200){
        fetchTasks();
        notifications.show({ title: 'Success', message: 'Task added successfully' });
      }else{
        notifications.show({ title: 'Error', message: 'Failed to add task' });
      }
      
    }).catch((err) => {
      console.log(err);
      notifications.show({ title: 'Error', message: 'Failed to add task' });
    });
  }

  return (
    <Paper padding="md">
      <form onSubmit={form.onSubmit(taskSubmit)}>
        <TextInput
          label="Task Name"
          placeholder="Enter task name"
          required
          {...form.getInputProps('taskName')}
        />
        <Textarea
          label="Description"
          placeholder="Enter task description"
          {...form.getInputProps('description')}
        />
        <TextInput
          label="Assigned To"
          placeholder="Enter user ID"
          {...form.getInputProps('assignedTo')}
        />
        <Select
          label="Priority"
          data={['High', 'Medium', 'Low']}
          placeholder="Select priority"
          {...form.getInputProps('priority')}
        />
        <Select
          label="Status"
          data={['To Do', 'In Progress', 'Completed']}
          placeholder="Select status"
          {...form.getInputProps('status')}
        />
       
        <Button type="submit" color="blue" fullWidth>
          Add Task
        </Button>
      </form>
    </Paper>
  );
};

export default AddTaskForm;