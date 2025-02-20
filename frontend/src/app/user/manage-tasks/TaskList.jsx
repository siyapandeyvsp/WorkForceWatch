// TaskList.jsx
import { Paper, Stack } from "@mantine/core";
import React, { useState } from "react";
import useAppContext from "@/context/AppContext";
import TaskCard from "@/components/TaskCard";
import useTaskContext from "@/context/TaskContext";

const TaskList = ({ employeeId }) => {
  const { axiosInstance } = useAppContext();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  const { fetchTasks, tasks } = useTaskContext();

  const updateTask = async (taskId, status, priority, description, assigned = true) => {
    try {
      const response = await axiosInstance.put(
        `task/update/${taskId}`,
        {
          status,
          priority,
          description,
          assigned,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": currentUser.token,
          },
        }
      );
      console.log("Task updated:", response.data);
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axiosInstance.delete(`task/delete/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser.token,
        },
      });
      console.log("Task deleted:", response.data);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const assignTask = async (taskId) => {
    try {
      const response = await axiosInstance.post(
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
      );
      console.log("Task assigned:", response.data);
      updateTask(taskId, "To Do", "Medium", "Task assigned to employee", true);
    } catch (err) {
      console.error("Failed to assign task:", err);
    }
  };

  return (
    <Paper padding="lg" shadow="md" radius="md" style={{ width: "100%", padding: "20px" }}>
      <Stack spacing="md">
        {tasks.map((task) => (
          <div key={task._id} style={{ width: "100%" }}>
            <TaskCard
              isAssigning={Boolean(employeeId)}
              assignfunction={() => assignTask(task._id)}
              deletefunction={() => deleteTask(task._id)}
              updatefunction={(taskId, status, priority, description) =>
                updateTask(task._id, status, priority, description)
              }
              task={task}
            />
          </div>
        ))}
      </Stack>
    </Paper>
  );
};

export default TaskList;