import { Badge, Text, Card, Button, Tooltip, Select, TextInput, Group, Stack, Modal, Switch } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import useAppContext from "@/context/AppContext";
import axios from "axios";

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
    case "High":
      return "red";
    case "Medium":
      return "orange";
    case "Low":
      return "green";
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

const TaskCard = ({ task, isAssigning, assignfunction, deletefunction, updatefunction }) => {
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [description, setDescription] = useState(task.description);
  const [taskName, setTaskName] = useState(task.taskName);
  const [progress, setProgress] = useState(task.progress);
  const [createdAt, setCreatedAt] = useState(task.createdAt);
  const [startTime, setStartTime] = useState(task.startTime);
  const [endTime, setEndTime] = useState(task.endTime);
  const [duration, setDuration] = useState(task.duration);
  const [modalOpened, setModalOpened] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const { axiosInstance } = useAppContext();

  useEffect(() => {
    if (isTimerRunning && startTime) {
      const interval = setInterval(() => {
        setDuration(Date.now() - new Date(startTime).getTime());
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, startTime]);

  const handleSave = () => {
    updatefunction(task._id, status, priority, description);
    setModalOpened(false);
  };

  const handleModalOpen = () => {
    setStatus(task.status);
    setPriority(task.priority);
    setDescription(task.description);
    setTaskName(task.taskName);
    setProgress(task.progress);
    setCreatedAt(task.createdAt);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setDuration(task.duration);
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const startTask = async () => {
    try {
      const response = await axiosInstance.put(`task/start/${task._id}`);
      setStartTime(response.data.startTime);
      setIsTimerRunning(true);
      console.log("Task started", response.data);
    } catch (err) {
      console.error("Failed to start task:", err);
    }
  };

  const stopTask = async () => {
    try {
      const response = await axiosInstance.put(`task/stop/${task._id}`);
      setEndTime(response.data.endTime);
      setIsTimerRunning(false);
      setDuration(response.data.duration);
      clearInterval(timer);
      console.log("Task stopped", response.data);
    } catch (err) {
      console.error("Failed to stop task:", err);
    }
  };

  const handleToggle = (checked) => {
    if (checked) {
      startTask();
    } else {
      stopTask();
    }
  };

  return (
    <>
      <Card
        padding="lg"
        shadow="md"
        radius="md"
        withBorder
        style={{
          borderLeft: `5px solid ${getBadgeColor(task.status)}`,
          marginBottom: '30px',
          height: '100px', // Reduced height for list view
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
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
        onClick={handleModalOpen}
      >
        <Stack spacing="xs">
          <Group position="apart">
            <Badge color={getBadgeColor(task.status)}>
              {task.status}
            </Badge>
            <Badge color={getPriorityColor(task.priority)}>
              {task.priority} Priority
            </Badge>
          </Group>
          <Tooltip label={task.taskName}>
            <Text weight={700} size="lg" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {task.taskName}
            </Text>
          </Tooltip>
          {isTimerRunning && (
            <Text size="sm" color="red">
              Running: {formatDuration(duration)}
            </Text>
          )}
          <Group position="right">
            <Switch
              checked={isTimerRunning}
              onChange={(event) => handleToggle(event.currentTarget.checked)}
              size="md"
              onLabel="ON"
              offLabel="OFF"
            />
          </Group>
          
        </Stack>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={handleModalClose}
        title="Edit Task"
      >
        <Stack spacing="xs">
          <TextInput
            label="Task Name"
            value={taskName}
            disabled
            onChange={(event) => setTaskName(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            multiline
            label="Description"
            height={1000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            label="Assigned By"
            value={`${task.assignedBy.name} (${task.assignedBy.email})`}
            disabled
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            label="Progress"
            type="number"
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            label="Task created At"
            value={new Date(createdAt).toLocaleString()}
            disabled
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            label="Task Assigned  At"
            value={new Date(task.assignedBy.createdAt).toLocaleString()}
            disabled
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            label="Start Time"
            value={startTime ? new Date(startTime).toLocaleString() : "Not Started"}
            onChange={(event) => setStartTime(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            label="End Time"
            value={endTime ? new Date(endTime).toLocaleString() : "Not Ended"}
            onChange={(event) => setEndTime(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextInput
            label="Duration"
            value={formatDuration(duration)}
            onChange={(event) => setDuration(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Select
            label="Status"
            placeholder="Select status"
            value={status}
            onChange={setStatus}
            data={[
              { value: 'To Do', label: 'To Do' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' }
            ]}
            mt="md"
          />
          <Select
            label="Priority"
            placeholder="Select priority"
            value={priority}
            onChange={setPriority}
            data={[
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' }
            ]}
            mt="md"
          />
          <Group position="right" mt="md">
            <Button size="xs" variant="outline" color="red" onClick={deletefunction}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            {isAssigning && (
              <Button size="xs" variant="light" color="blue" onClick={assignfunction}>
                Assign to Employee
              </Button>
            )}
            <Button size="xs" variant="filled" color="green" onClick={handleSave}>
              Save
            </Button>
            {isTimerRunning ? (
              <Button size="xs" variant="filled" color="red" onClick={stopTask}>
                Stop
              </Button>
            ) : (
              <Button size="xs" variant="filled" color="blue" onClick={startTask}>
                Start
              </Button>
            )}
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default TaskCard;