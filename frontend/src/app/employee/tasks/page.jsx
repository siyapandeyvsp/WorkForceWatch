"use client";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Card,
  Badge,
  Container,
  Grid,
  Text,
  Group,
  Button,
  Title,
  Divider,
  Select,
  TextInput,
  Switch
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useAppContext from "@/context/AppContext";

const getBadgeColor = (status) => {
  switch (status) {
    case "In Progress":
      return "blue";
    case "Completed":
      return "green";
    case "To Do":
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

const formatDuration = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
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
        `/assignment/getbyemployee/${employee?._id}`
      );
      console.log(response.data.result);
      setTasks(response.data.result || []);
    };

    fetchTasks();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceTasks = tasksByStatus[source.droppableId];
      const destTasks = tasksByStatus[destination.droppableId];
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.task.status = destination.droppableId;
      destTasks.splice(destination.index, 0, movedTask);

      setTasks([...tasks]);
    } else {
      const tasks = tasksByStatus[source.droppableId];
      const [movedTask] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, movedTask);

      setTasks([...tasks]);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    const updatedTask = {
      ...task,
      task: {
        ...task.task,
        status: newStatus
      }
    };

    try {
      const response = await axiosInstance.put(`/assignment/update/${task._id}`, updatedTask);
      setTasks(tasks.map(t => t._id === task._id ? response.data.result : t));
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const startTask = async (taskId) => {
    try {
      const response = await axiosInstance.put(`task/start/${taskId}`);
      return response.data.result.startTime;
    } catch (err) {
      console.error("Failed to start task:", err);
    }
  };

  const stopTask = async (taskId) => {
    try {
      const response = await axiosInstance.put(`task/stop/${taskId}`);
      return {
        endTime: response.data.result.endTime,
        duration: response.data.result.duration
      };
    } catch (err) {
      console.error("Failed to stop task:", err);
    }
  };

  const tasksByStatus = {
    "To Do": tasks.filter(task => task?.task?.status === "To Do"),
    "In Progress": tasks.filter(task => task?.task?.status === "In Progress"),
    Completed: tasks.filter(task => task?.task?.status === "Completed"),
  };

  return (
    <Container size="xl" padding="md">
      <Paper padding="lg" shadow="md" radius="md">
        <Title order={2} ta="center" mb="lg">
          Assigned Tasks
        </Title>
        <Divider my="sm" />
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid gutter="lg">
            {Object.keys(tasksByStatus).map((status) => (
              <Grid.Col span={4} key={status}>
                <Title order={4} ta="center" mb="md">
                  {status}
                </Title>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: '300px',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                      }}
                    >
                      {tasksByStatus[status].map((task, index) => (
                        <TaskCardWrapper key={task._id} task={task} index={index} handleStatusChange={handleStatusChange} startTask={startTask} stopTask={stopTask} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Grid.Col>
            ))}
          </Grid>
        </DragDropContext>
      </Paper>
    </Container>
  );
};

const TaskCardWrapper = ({ task, index, handleStatusChange, startTask, stopTask }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(task.startTime);
  const [endTime, setEndTime] = useState(task.endTime);
  const [duration, setDuration] = useState(task.duration);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (isTimerRunning && startTime) {
      const interval = setInterval(() => {
        setDuration(Date.now() - new Date(startTime).getTime());
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, startTime]);

  const renderTaskCard = (task, index, isTimerRunning, setIsTimerRunning, startTime, setStartTime, endTime, setEndTime, duration, setDuration, timer, setTimer) => (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <Card
          padding="lg"
          shadow="md"
          radius="md"
          m="md"
          withBorder
          style={{
            borderLeft: `5px solid ${getPriorityColor(task?.task?.priority || "Low")}`,
            marginBottom: '30px', // Increased marginBottom for vertical space
            height: '220px', // Fixed height for all cards
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: isTimerRunning ? "#e0f7fa" : "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Stack spacing="xs">
            <Group position="apart">
              <Badge color={getPriorityColor(task?.task?.priority || "Low")}>
                {task?.task?.priority || "Low"} Priority
              </Badge>
              <Badge color={getBadgeColor(task?.task?.status || "To Do")}>
                {task?.task?.status || "To Do"}
              </Badge>
            </Group>
            <Text size="lg" weight={700}>
              {task?.task?.taskName || "No Task Name"}
            </Text>
            <Text size="sm" color="dimmed">
              {task?.task?.description || "No Description Available"}
            </Text>
            <Text size="sm" color="dimmed">
              Due Date: {task?.task?.dueDate || "No Due Date"}
            </Text>
            <TextInput
              label="Start Time"
              value={startTime ? new Date(startTime).toLocaleString() : "Not Started"}
              disabled
              style={{ marginBottom: "10px" }}
            />
            <TextInput
              label="End Time"
              value={endTime ? new Date(endTime).toLocaleString() : "Not Ended"}
              disabled
              style={{ marginBottom: "10px" }}
            />
            <TextInput
              label="Duration"
              value={formatDuration(duration)}
              disabled
              style={{ marginBottom: "10px" }}
            />
            <Select
              label="Status"
              placeholder="Select status"
              value={task?.task?.status}
              onChange={(value) => handleStatusChange(task, value)}
              data={[
                { value: 'To Do', label: 'To Do' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' }
              ]}
              mt="md"
            />
            <Group position="right" mt="md">
              <Switch
                checked={isTimerRunning}
                onChange={async (event) => {
                  const checked = event.currentTarget.checked;
                  if (checked) {
                    const newStartTime = await startTask(task.task._id);
                    setStartTime(newStartTime);
                    setIsTimerRunning(true);
                  } else {
                    const { endTime, duration } = await stopTask(task.task._id);
                    setEndTime(endTime);
                    setDuration(duration);
                    setIsTimerRunning(false);
                    clearInterval(timer);
                  }
                }}
                size="md"
                onLabel="ON"
                offLabel="OFF"
              />
              <Button size="xs" variant="outline" color="blue">
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button size="xs" variant="outline" color="green">
                <FontAwesomeIcon icon={faCheck} />
              </Button>
            </Group>
          </Stack>
        </Card>
      )}
    </Draggable>
  );

  return renderTaskCard(task, index, isTimerRunning, setIsTimerRunning, startTime, setStartTime, endTime, setEndTime, duration, setDuration, timer, setTimer);
};

export default EmployeeTasksPage;