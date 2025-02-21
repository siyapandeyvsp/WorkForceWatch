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
} from "@mantine/core";
import { showNotification } from '@mantine/notifications';
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
  console.log("TIME", time);
  return time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',second:'2-digit', hour12: false }) : "00:00";
};

const Clocky = () => {
  const [employee, setEmployee] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );
  const [assignments, setAssignments] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const { axiosInstance } = useAppContext();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axiosInstance.get(
          `/assignment/getbyemployee/${employee?._id}`
        );
        console.log("RES /assignment/getbyemployee/${employee/_id}", response.data);
        setAssignments(response.data.result || []);
        // showNotification({ message: "Assignments fetched successfully", color: "green" });
      } catch (error) {
        console.error("Failed to fetch assignments", error);
        showNotification({ message: "Failed to fetch assignments", color: "red" });
      }
    };

    fetchAssignments();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const reorderedAssignments = Array.from(assignments);
    const [movedAssignment] = reorderedAssignments.splice(source.index, 1);
    reorderedAssignments.splice(destination.index, 0, movedAssignment);

    setAssignments(reorderedAssignments);
  };

  const handleStatusChange = async (assignment, newStatus) => {
    if (!assignment || !assignment._id) return;
    const updatedAssignment = {
      ...assignment,
      task: {
        ...assignment.task,
        status: newStatus
      }
    };

    try {
      const response = await axiosInstance.put(`/assignment/update/${assignment._id}`, updatedAssignment);
      setAssignments(assignments.map(a => a._id === assignment._id ? response.data.result : a));
      showNotification({ message: "Status has been updated", color: "green" });
    } catch (error) {
      console.error("Failed to update task status", error);
      showNotification({ message: "Failed to update status", color: "red" });
    }
  };

  const handleFieldChange = async (assignment, field, value) => {
    if (!assignment || !assignment._id) return;
    const updatedAssignment = {
      ...assignment,
      task: {
        ...assignment.task,
        [field]: value
      }
    };

    try {
      const response = await axiosInstance.put(`/assignment/update/${assignment._id}`, updatedAssignment);
      setAssignments(assignments.map(a => a._id === assignment._id ? response.data.result.result : a));
      showNotification({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated`, color: "green" });
    } catch (error) {
      console.error(`Failed to update task ${field}`, error);
      showNotification({ message: `Failed to update ${field}`, color: "red" });
    }
  };

  const startTask = async (taskId) => {
    try {
      const response = await axiosInstance.put(`task/start/${taskId}`);
      showNotification({ message: "Task has been started", color: "green" });
      return response.data.result.startTime;
    } catch (err) {
      console.error("Failed to start task:", err);
      showNotification({ message: "Failed to start task", color: "red" });
    }
  };

  const stopTask = async (taskId) => {
    try {
      const response = await axiosInstance.put(`task/stop/${taskId}`);
      showNotification({ message: "Task has been stopped", color: "green" });
      return {
        endTime: response.data.result.endTime,
        duration: response.data.result.duration
      };
    } catch (err) {
      console.error("Failed to stop task:", err);
      showNotification({ message: "Failed to stop task", color: "red" });
    }
  };

  const sortedAssignments = assignments.sort((a, b) => new Date(b.task.startTime) - new Date(a.task.startTime));

  return (
    <Container size="xl" padding="md">
      <Paper padding="lg" shadow="md" radius="md">
        <Title order={2} ta="center" mb="lg">
          Assigned Tasks
        </Title>
        <Divider my="sm" />
        <TaskListItem assignment={activeAssignment || { task: {} }} index={-1} handleStatusChange={handleStatusChange} handleFieldChange={handleFieldChange} startTask={startTask} stopTask={stopTask} setActiveAssignment={setActiveAssignment} setAssignments={setAssignments} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="assignments">
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
                {sortedAssignments.map((assignment, index) => (
                  <TaskListItem key={assignment._id} assignment={assignment} index={index} handleStatusChange={handleStatusChange} handleFieldChange={handleFieldChange} startTask={startTask} stopTask={stopTask} setActiveAssignment={setActiveAssignment} setAssignments={setAssignments} />
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

const TaskListItem = ({ assignment, index, handleStatusChange, handleFieldChange, startTask, stopTask, setActiveAssignment, setAssignments }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(assignment?.task?.startTime);
  const [endTime, setEndTime] = useState(assignment?.task?.endTime);
  const [duration, setDuration] = useState(assignment?.task?.duration || 0); // Ensure duration is a number
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    console.log("ASSIGNMENT", assignment);
    console.log("TIMER RUNNING", isTimerRunning);
    console.log("START TIME", startTime);
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
        value={assignment?.task?.taskName || ""}
        onChange={(e) => handleFieldChange(assignment, "taskName", e.currentTarget.value)}
        className={classes.labelSmallGray}
        style={{ flex: 2 }}
      />
      <div style={{ display: 'flex', flex: 3, justifyContent: 'flex-end', gap: '10px' }}>
        <TextInput
          label="Start Time"
          value={formatTime(startTime)}
          onChange={(e) => handleFieldChange(assignment, "startTime", e.currentTarget.value)}
          className={cx(classes.textRight, classes.inputSmall, classes.labelSmallGray)}
          style={{ flex: 1 }}
        />
        <TextInput
          label="End Time"
          value={formatTime(endTime)}
          onChange={(e) => handleFieldChange(assignment, "endTime", e.currentTarget.value)}
          className={cx(classes.textRight, classes.inputSmall, classes.labelSmallGray)}
          style={{ flex: 1 }}
        />
        <TextInput
          label="Duration"
          value={formatDuration(duration)}
          onChange={(e) => handleFieldChange(assignment, "duration", e.currentTarget.value)}
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
                const { endTime, duration } = await stopTask(assignment?.task?._id) || {};
                setEndTime(endTime);
                setDuration(duration);
                setIsTimerRunning(false);
                clearInterval(timer);
                setActiveAssignment(null);
              } else {
                const newStartTime = await startTask(assignment?.task?._id);
                setStartTime(newStartTime);
                setIsTimerRunning(true);
                setActiveAssignment(assignment);
                setAssignments(prevAssignments => {
                  const updatedAssignments = prevAssignments.filter(a => a._id !== assignment._id);
                  return [assignment, ...updatedAssignments];
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
    <Draggable key={assignment?._id} draggableId={assignment?._id} index={index}>
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