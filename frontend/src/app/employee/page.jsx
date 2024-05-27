"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  Timeline,
  Avatar,
  Group,
  List,
  Modal,
} from "@mantine/core";
import {
  IconCheck,
  IconClock,
  IconBriefcase,
  IconBell,
  IconChevronRight,
} from "@tabler/icons-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import styles from "./page.module.css"; // Import the CSS module

import useAppContext from "@/context/AppContext";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );
  const [tasks, setTasks] = useState([]);
  const [workSessions, setWorkSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskModalOpened, setTaskModalOpened] = useState(false);
  const { axiosInstance } = useAppContext();

  ChartJS.register(ArcElement, Tooltip, Legend);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axiosInstance.get(
          `/employee/getbyid/${employee._id}`
        );
        setEmployee({ ...employee, ...response.data });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(
          `/assignment/getbyemployee/${employee._id}`
        );
        setTasks(response.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchWorkSessions = async () => {
      try {
        const response = await axiosInstance.get(
          `/work-session/getbyemployee/${employee._id}`
        );
        setWorkSessions(response.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployee();
    fetchTasks();
    fetchWorkSessions();
  }, [employee._id, axiosInstance]);

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

  const getCurrentTask = () => {
    return tasks.find((task) => task.task.status === "In Progress");
  };

  const getRecentWorkSessions = () => {
    return workSessions.slice(0, 3);
  };

  const countTasksByStatus = (status) => {
    return tasks.filter((task) => task.task.status === status).length;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setTaskModalOpened(true);
  };

  const isTaskDate = (date) => {
    return tasks.some(
      (task) => new Date(task.task.createdAt).toDateString() === date.toDateString()
    );
  };

  const isAttendanceDate = (date) => {
    return workSessions.some(
      (session) => new Date(session.checkInTime).toDateString() === date.toDateString()
    );
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (task.task.createdAt && date) {
        return new Date(task.task.createdAt).toDateString() === date.toDateString();
      }
      return false;
    });
  };

  const getAttendanceForDate = (date) => {
    return workSessions.filter((session) => {
      if (session.checkInTime && date) {
        return new Date(session.checkInTime).toDateString() === date.toDateString();
      }
      return false;
    });
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const currentTask = getCurrentTask();
  const recentWorkSessions = getRecentWorkSessions();
  const selectedTasks = getTasksForDate(selectedDate);
  const selectedAttendance = getAttendanceForDate(selectedDate);

  return (
    <Container p="sm">
      <Grid>
        {/* Welcome Message */}
        <Grid.Col span={12}>
          <Title order={3}>
            {getGreeting()}, {employee.name.split(" ")[0]}
          </Title>
        </Grid.Col>

        {/* Profile Summary */}
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" mb="sm">
            <Group>
              <Stack>
                <Title order={2}>{employee.name}</Title>
                <Text>{employee.designation}</Text>
                <Text>{employee.email}</Text>
                <Text>{employee.contactNumber}</Text>
              </Stack>
              <Avatar src={employee.avatar} size={100} radius="xl" />
            </Group>
          </Card>
        </Grid.Col>

        {/* Calendar */}
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg">
            <Title order={3}>Task and Attendance Calendar</Title>
            <Calendar
              value={selectedDate}
              onChange={handleDateClick}
              renderDay={(date) => (
                <div>
                  <div>{date.getDate()}</div>
                  {isTaskDate(date) && <div className={styles.taskDot} />}
                  {isAttendanceDate(date) && <div className={styles.attendanceDot} />}
                </div>
              )}
            />
          </Card>
        </Grid.Col>

        {/* Task Status */}
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg">
            <Title order={3}>Task Status</Title>
            <Doughnut
              data={{
                labels: ["To Do", "In Progress", "Completed"],
                datasets: [
                  {
                    data: [
                      countTasksByStatus("To Do"),
                      countTasksByStatus("In Progress"),
                      countTasksByStatus("Completed"),
                    ],
                    backgroundColor: ["#add8e6", "#ffffb3", "#90ee90"],
                    hoverBackgroundColor: ["#85c1e9", "#fefcbf", "#7ccd7c"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                    labels: {
                      boxWidth: 20,
                      padding: 10,
                    },
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                cutout: "70%",
                responsive: true,
              }}
            />
          </Card>
        </Grid.Col>

        {/* Current Task */}
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg">
            <Title order={3}>Current Task</Title>
            {currentTask ? (
              <div>
                <Text>{currentTask.task.taskName}</Text>
                <Badge
                  color={getPriorityColor(currentTask.task.priority)}
                  style={{ marginBottom: "5px" }}
                >
                  Priority: {currentTask.task.priority}
                </Badge>
                <Text>{currentTask.description}</Text>
                <Text>
                  Assigned on :{" "}
                  {new Date(currentTask.task.createdAt).toLocaleDateString()}
                </Text>
              </div>
            ) : (
              <Text>No current task assigned.</Text>
            )}
          </Card>
        </Grid.Col>

        {/* Recent Work Sessions */}
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg">
            <Title order={3}>Recent Work Sessions</Title>
            <Timeline>
              {recentWorkSessions.map((session) => (
                <Timeline.Item
                  key={session._id}
                  title={`Checked in at ${new Date(
                    session.checkInTime
                  ).toLocaleTimeString()}`}
                >
                  <Text size="sm">
                    Checked out at{" "}
                    {new Date(session.checkOutTime).toLocaleTimeString()}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Grid.Col>

        {/* Pending Tasks */}
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg">
            <Title order={3}>Pending Tasks</Title>
            <List>
              {tasks
                .filter((task) => task.task.status === "To Do")
                .slice(0, 5)
                .map((task) => (
                  <List.Item key={task._id}>
                    {task.task.taskName}{" "}
                    <Badge
                      color={getPriorityColor(task.task.priority)}
                      style={{ marginBottom: "5px" }}
                    >
                      Priority: {task.task.priority}
                    </Badge>
                  </List.Item>
                ))}
            </List>
          </Card>
        </Grid.Col>

        {/* Notifications */}
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg">
            <Title order={3}>Notifications</Title>
            <List>
              <List.Item icon={<IconBell size={16} />}>
                System update: Maintenance scheduled for 10pm tonight
              </List.Item>
              <List.Item icon={<IconBell size={16} />}>
                Message from HR: Mandatory meeting at 3pm tomorrow
              </List.Item>
              <List.Item icon={<IconBell size={16} />}>
                Reminder: Complete your annual health checkup
              </List.Item>
            </List>
          </Card>
        </Grid.Col>

        {/* Detailed Tasks and Attendance for Selected Date */}
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg">
            <Title order={3}>
              Details for {selectedDate?.toLocaleDateString() || "Select a date"}
            </Title>
            <Title order={4}>Tasks</Title>
            {selectedTasks.length > 0 ? (
              <List>
                {selectedTasks.map((task) => (
                  <List.Item key={task._id}>
                    {task.task.taskName}{" "}
                    <Badge
                      color={getPriorityColor(task.task.priority)}
                      style={{ marginBottom: "5px" }}
                    >
                      Priority: {task.task.priority}
                    </Badge>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text>No tasks created on this date.</Text>
            )}
            <Title order={4}>Attendance</Title>
            {selectedAttendance.length > 0 ? (
              <List>
                {selectedAttendance.map((session) => (
                  <List.Item key={session._id}>
                    Checked in at{" "}
                    {new Date(session.checkInTime).toLocaleTimeString()} and
                    checked out at{" "}
                    {new Date(session.checkOutTime).toLocaleTimeString()}
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text>No attendance recorded on this date.</Text>
            )}
          </Card>
        </Grid.Col>

        {/* Quick Links */}
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg">
            <Group>
              <Button
                component="a"
                href="/profile"
                rightIcon={<IconChevronRight />}
              >
                Profile
              </Button>
              <Button
                component="a"
                href="/tasks"
                rightIcon={<IconChevronRight />}
              >
                Tasks
              </Button>
              <Button
                component="a"
                href="/work-sessions"
                rightIcon={<IconChevronRight />}
              >
                Work Sessions
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Task Modal */}
      <Modal
        opened={taskModalOpened}
        onClose={() => setTaskModalOpened(false)}
        title={`Tasks for ${selectedDate?.toLocaleDateString()}`}
      >
        <List>
          {selectedTasks.map((task) => (
            <List.Item key={task._id}>
              {task.task.taskName}{" "}
              <Badge
                color={getPriorityColor(task.task.priority)}
                style={{ marginBottom: "5px" }}
              >
                Priority: {task.task.priority}
              </Badge>
            </List.Item>
          ))}
        </List>
      </Modal>
    </Container>
  );
};

export default EmployeeDashboard;
