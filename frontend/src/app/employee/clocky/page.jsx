"use client";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Container,
  Text,
  Group,
  Title,
  Divider,
  TextInput,
  Button,
  showNotification
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useAppContext from "@/context/AppContext";
import cx from 'clsx';
import { useListState } from '@mantine/hooks';
import classes from './DndList.module.css';

const formatDuration = (duration) => {
  if (!duration) return "00:00:00";
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const formatTime = (time) => {
  return time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "00:00";
};

const Clocky = () => {
  const [employee, setEmployee] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
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

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    setTasks(reorderedTasks);
  };

  const handleStatusChange = async (task, newStatus) => {
    if (!task || !task._id) return;
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
      showNotification({ message: "Status has been updated" });
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const handleFieldChange = async (task, field, value) => {
    if (!task || !task._id) return;
    const updatedTask = {
      ...task,
      task: {
        ...task.task,
        [field]: value
      }
    };

    try {
      const response = await axiosInstance.put(`/assignment/update/${task._id}`, updatedTask);
      setTasks(tasks.map(t => t._id === task._id ? response.data.result.result : t));
      showNotification({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated` });
    } catch (error) {
      console.error(`Failed to update task ${field}`, error);
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

  const sortedTasks = tasks.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  return (
    <Container size="xl" padding="md">
      <Paper padding="lg" shadow="md" radius="md">
        <Title order={2} ta="center" mb="lg">
          Assigned Tasks
        </Title>
        <Divider my="sm" />
        <TaskListItem task={activeTask || { task: {} }} index={-1} handleStatusChange={handleStatusChange} handleFieldChange={handleFieldChange} startTask={startTask} stopTask={stopTask} setActiveTask={setActiveTask} setTasks={setTasks} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
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
                {sortedTasks.map((task, index) => (
                  <TaskListItem key={task._id} task={task} index={index} handleStatusChange={handleStatusChange} handleFieldChange={handleFieldChange} startTask={startTask} stopTask={stopTask} setActiveTask={setActiveTask} setTasks={setTasks} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    </Container>
  );
};

const TaskListItem = ({ task, index, handleStatusChange, handleFieldChange, startTask, stopTask, setActiveTask, setTasks }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(task?.startTime);
  const [endTime, setEndTime] = useState(task?.endTime);
  const [duration, setDuration] = useState(task?.duration);
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

  const taskContent = (
    <div
      className={cx(classes.item, { [classes.itemDragging]: index !== -1, [classes.highlighted]: index === -1 })}
      style={{
        backgroundColor: isTimerRunning ? "#e0f7fa" : "white",
        marginBottom: '10px',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '10px',
        width: '100%',
        paddingLeft: '1rem',  
        paddingRight: '1rem',  
      }}
    >
      <TextInput
        label="Task Name"
        value={task?.task?.taskName || ""}
        onChange={(e) => handleFieldChange(task, "taskName", e.currentTarget.value)}
        className={classes.labelSmallGray}
        style={{ flex: 2 }}
      />
      <div style={{ display: 'flex', flex: 3, justifyContent: 'flex-end', gap: '10px' }}>
        <TextInput
          label="Start Time"
          value={formatTime(startTime)}
          onChange={(e) => handleFieldChange(task, "startTime", e.currentTarget.value)}
          className={cx(classes.textRight, classes.inputSmall, classes.labelSmallGray)}
          style={{ flex: 1 }}
        />
        <TextInput
          label="End Time"
          value={formatTime(endTime)}
          onChange={(e) => handleFieldChange(task, "endTime", e.currentTarget.value)}
          className={cx(classes.textRight, classes.inputSmall, classes.labelSmallGray)}
          style={{ flex: 1 }}
        />
        <TextInput
          label="Duration"
          value={formatDuration(duration)}
          onChange={(e) => handleFieldChange(task, "duration", e.currentTarget.value)}
          className={cx(classes.textRight, classes.inputSmall, classes.labelSmallGray)}
          style={{ flex: 1 }}
        />
        <Group position="right" mt="md" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button
            size="xs"
            variant="outline"
            color={isTimerRunning ? "red" : "green"}
            onClick={async () => {
              if (isTimerRunning) {
                const { endTime, duration } = await stopTask(task?.task?._id) || {};
                setEndTime(endTime);
                setDuration(duration);
                setIsTimerRunning(false);
                clearInterval(timer);
                setActiveTask(null);
              } else {
                const newStartTime = await startTask(task?.task?._id);
                setStartTime(newStartTime);
                setIsTimerRunning(true);
                setActiveTask(task);
                setTasks(prevTasks => {
                  const updatedTasks = prevTasks.filter(t => t._id !== task._id);
                  return [task, ...updatedTasks];
                });
              }
            }}
          >
            <FontAwesomeIcon icon={isTimerRunning ? faStop : faPlay} />
          </Button>
        </Group>
      </div>
    </div>
  );

  return index === -1 ? taskContent : (
    <Draggable key={task?._id} draggableId={task?._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {taskContent}
        </div>
      )}
    </Draggable>
  );
};

export default Clocky;