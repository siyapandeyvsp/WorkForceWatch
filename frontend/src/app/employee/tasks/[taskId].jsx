"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Paper,
  Stack,
  Card,
  Badge,
  Container,
  Text,
  Group,
  Button,
  Title,
  Divider,
  TextInput,
  Switch
} from "@mantine/core";
import useAppContext from "@/context/AppContext";

const formatDuration = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const AssignmentDetailsPage = () => {
  const router = useRouter();
  const { taskId } = router.query;
  const [task, setTask] = useState(null);
  const { axiosInstance } = useAppContext();

  useEffect(() => {
    const fetchTask = async () => {
      const response = await axiosInstance.get(`/task/${taskId}`);
      setTask(response.data);
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const startTask = async () => {
    try {
      const response = await axiosInstance.put(`/task/start/${taskId}`);
      setTask((prevTask) => ({
        ...prevTask,
        subtasks: [...prevTask.subtasks, response.data],
      }));
    } catch (err) {
      console.error("Failed to start task:", err);
    }
  };

  const stopTask = async () => {
    try {
      const response = await axiosInstance.put(`/task/stop/${taskId}`);
      setTask((prevTask) => {
        const updatedSubtasks = [...prevTask.subtasks];
        updatedSubtasks[updatedSubtasks.length - 1] = response.data;
        return { ...prevTask, subtasks: updatedSubtasks };
      });
    } catch (err) {
      console.error("Failed to stop task:", err);
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <Container size="xl" padding="md">
      <Paper padding="lg" shadow="md" radius="md">
        <Title order={2} ta="center" mb="lg">
          Task Details
        </Title>
        <Divider my="sm" />
        <Stack spacing="md">
          <Text size="lg" weight={700}>
            {task.taskName}
          </Text>
          <Text size="sm" color="dimmed">
            {task.description}
          </Text>
          <Group position="apart">
            <Badge color="blue">{task.priority} Priority</Badge>
            <Badge color="green">{task.status}</Badge>
          </Group>
          <Button onClick={startTask}>Start Task</Button>
          <Button onClick={stopTask}>Stop Task</Button>
          <Divider my="sm" />
          <Title order={4}>Subtasks</Title>
          {task.subtasks.map((subtask, index) => (
            <Card key={index} padding="lg" shadow="md" radius="md" withBorder>
              <TextInput
                label="Start Time"
                value={subtask.startTime ? new Date(subtask.startTime).toLocaleString() : "Not Started"}
                disabled
              />
              <TextInput
                label="End Time"
                value={subtask.endTime ? new Date(subtask.endTime).toLocaleString() : "Not Ended"}
                disabled
              />
              <TextInput
                label="Duration"
                value={formatDuration(subtask.duration)}
                disabled
              />
            </Card>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default AssignmentDetailsPage;
