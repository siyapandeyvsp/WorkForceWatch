"use client";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Image,
  TextInput,
  Avatar,
  Button,
  Container,
  Tabs,
  Group,
  Grid,
  Notification,
  Text,
  Badge,
  Card,
  Select
} from "@mantine/core";
import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";

import useAppContext from "@/context/AppContext";

const getBadgeColor = (status) => {
    switch (status) {
      case "In Progress":
        return "blue";
      case "Completed":
        return "green";
      case "Pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "green";
      case "Medium":
        return "yellow";
      case "High":
        return "red";
      default:
        return "gray";
    }
  };
const EmployeeTasksPage = () => {
  const [employee, setEmployee] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );
  const [tasks, setTasks] = useState([]);
  const { axiosInstance } = useAppContext();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axiosInstance.get(
        `/assignment/getbyemployee/${employee._id}`
      );
      console.log(response.data);
      setTasks(response.data || []);
    };

    fetchTasks();
  }, []);

  // const updateTask = async (taskId, status) => {
  //   await axiosInstance
  //     .put(
  //       `task/update/${taskId}`,
  //       {
  //         status,
  //         assigned: true,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           // "x-auth-token": currentUser.token,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       // Update the local state
  //       setTasks((prevTasks) =>
  //         prevTasks.map((task) =>
  //           task._id === taskId ? { ...task, task: { ...task.task, status } } : task
  //         )
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  return (
    <Container>
      <Paper padding="md" shadow="xs">
        <Text size="xl" ta="center">
          Assigned Tasks{" "}
        </Text>
        <Grid gutter="md">
          {tasks.map((task) => (
            <Grid.Col span={6}>
              <Card
                padding="md"
                shadow="xs"
                style={{ 
                  borderRight: `5px solid ${getPriorityColor(task.task.priority)}`, 
                  marginBottom: '10px',
                  height:'auto' 
                }}
              >
                <Stack>
                  <Badge
                    color={getPriorityColor(task.task.priority)}
                    style={{ marginBottom: "5px" }}
                  >
                    Priority: {task.task.priority}
                  </Badge>
                  <Text  size="xl" weight={700} style={{ marginBottom: "10px" }}>
                    {task.task.taskName}
                  </Text>
                  <Text size="sm" color="dimmed" style={{ marginBottom: "10px" }}>
                    {task.task.description}
                  </Text>
                 
                  <Badge
                color={getBadgeColor(task.task.status)}
                style={{ marginBottom: "5px" }}
              >
                Status: {task.task.status}
              </Badge>
                
                  
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default EmployeeTasksPage;
