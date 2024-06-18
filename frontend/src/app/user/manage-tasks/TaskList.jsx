"use client";
import { Badge, Text, Card, Grid } from "@mantine/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFetchAllTasks } from "../../../hooks/useFetchAllTasks";
import useAppContext from "@/context/AppContext";

import TaskCard from "@/components/TaskCard";
import useTaskContext from "@/context/TaskContext";

const TaskList = ({ employeeId }) => {
  // const [tasks, setTasks] = useState([]);
  const { axiosInstance } = useAppContext();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  const { fetchTasks, tasks } = useTaskContext();

  const updateTask = async (taskId, status, priority, description) => {
    const response = await axiosInstance
      .put(
        `task/update/${taskId}`,
        {
          status,
          priority,
          description,
          assigned: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": currentUser.token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        fetchTasks();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axiosInstance.delete(`task/delete/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser.token,
        },
      });
      console.log(response);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };


  const assignTask = async (taskId) => {
    const response = await axiosInstance
      .post(
        "assignment/add",
        {
          task: taskId,
          assignedTo: employeeId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": currentUser.token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        updateTask(taskId);
      })
      .catch((err) => {
        console.log(err);
      });
      
  };

  // useEffect(() => {
  //       const fetchTasks = async () => {
  //         const response = await axios.get("http://localhost:5000/task/getall");
  //         console.log(response.data)
  //         setTasks(response.data);
  //       };

  //       fetchTasks();
  //     }, []);

  return (
    <Grid gutter="md" style={{ maxWidth: "100%", padding: "20px" }}>
      {tasks.map((task) => (
        <Grid.Col span={4} key={task._id}>
          <TaskCard
            isAssigning={Boolean(employeeId)}
            assignfunction={() => assignTask(task._id)}
            deletefunction={() => deleteTask(task._id)}
            updatefunction={(taskId,status, priority, description) => updateTask(task._id, status, priority, description)}

            task={task}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default TaskList;
