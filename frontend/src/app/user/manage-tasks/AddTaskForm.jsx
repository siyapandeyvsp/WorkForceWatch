"use client";
import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Select, Button, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const AddTaskForm = ({ employeeId = '', assigned = false }) => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem('user'))
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employee/getall");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/task/getall");
    setTasks(response.data);
  };

  const form = useForm({
    initialValues: {
      taskName: '',
      description: '',
      priority: '',
      status: '',
      assignedTo: employeeId,
      assigned: assigned
    },

    validate: {
      taskName: (value) => value.trim().length > 0 ? null : 'Task name is required',
    },
  });

  const taskSubmit = (values) => {
    axios.post('http://localhost:5000/task/add', values, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': currentUser.token,
      }
    })
    .then((res) => {
      if (res.status === 200) {
        fetchTasks();
        notifications.show({ title: 'Success', message: 'Task added successfully' });
      } else {
        notifications.show({ title: 'Error', message: 'Failed to add task' });
      }
    }).catch((err) => {
      console.error(err);
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
        <Select
          label="Assigned To"
          placeholder="Select employee"
          data={employees.filter(employee => employee && employee._id && employee.name).map(employee => ({ value: employee._id, label: employee.name }))}
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