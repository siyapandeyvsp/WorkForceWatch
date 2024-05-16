"use client";
import { Button, TextInput, Paper } from '@mantine/core';
import axios from 'axios';
import React, { useState } from 'react';

const TaskForm = () => {
  const [task, setTask] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/tasks/add', { task });
    setTask('');
  };

  return (
    <Paper padding="md">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Task"
          placeholder="Enter task"
          value={task}
          onChange={(event) => setTask(event.currentTarget.value)}
        />
        <Button mt="md">Add Task</Button>
      </form>
    </Paper>
  );
};

export default TaskForm;