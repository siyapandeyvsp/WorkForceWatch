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
  Divider,
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
import AnalogClock from "@/components/AnalogClock";
import AttendanceSummary from "@/components/AttendanceSummary";
import GridCard from "@/components/GridCard";
const DUMMY_ATTENDENCE = [
  {
    "_id": "6651b2334af5388b51e7f755",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-01T09:00:00.000Z",
    "checkOutTime": "2024-10-01T17:00:00.000Z",
    "createdAt": "2024-10-01T09:00:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f756",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-03T09:30:00.000Z",
    "checkOutTime": "2024-10-03T16:30:00.000Z",
    "createdAt": "2024-10-03T09:30:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f757",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-05T09:45:00.000Z",
    "checkOutTime": "2024-10-05T17:15:00.000Z",
    "createdAt": "2024-10-05T09:45:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f758",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-07T08:55:00.000Z",
    "checkOutTime": "2024-10-07T17:05:00.000Z",
    "createdAt": "2024-10-07T08:55:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f759",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-09T09:10:00.000Z",
    "checkOutTime": "2024-10-09T17:20:00.000Z",
    "createdAt": "2024-10-09T09:10:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f760",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-11T09:30:00.000Z",
    "checkOutTime": "2024-10-11T17:00:00.000Z",
    "createdAt": "2024-10-11T09:30:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f761",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-13T09:00:00.000Z",
    "checkOutTime": "2024-10-13T17:15:00.000Z",
    "createdAt": "2024-10-13T09:00:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f762",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-15T09:20:00.000Z",
    "checkOutTime": "2024-10-15T17:00:00.000Z",
    "createdAt": "2024-10-15T09:20:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f763",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-17T09:10:00.000Z",
    "checkOutTime": "2024-10-17T17:30:00.000Z",
    "createdAt": "2024-10-17T09:10:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f764",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-19T09:25:00.000Z",
    "checkOutTime": "2024-10-19T17:05:00.000Z",
    "createdAt": "2024-10-19T09:25:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f765",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-21T09:00:00.000Z",
    "checkOutTime": "2024-10-21T17:10:00.000Z",
    "createdAt": "2024-10-21T09:00:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f766",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-10-23T09:30:00.000Z",
    "checkOutTime": "2024-10-23T17:00:00.000Z",
    "createdAt": "2024-10-23T09:30:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f767",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-11-01T09:00:00.000Z",
    "checkOutTime": "2024-11-01T17:00:00.000Z",
    "createdAt": "2024-11-01T09:00:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f768",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-11-03T09:15:00.000Z",
    "checkOutTime": "2024-11-03T17:00:00.000Z",
    "createdAt": "2024-11-03T09:15:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f769",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-11-05T09:00:00.000Z",
    "checkOutTime": "2024-11-05T17:00:00.000Z",
    "createdAt": "2024-11-05T09:00:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f770",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-11-07T09:30:00.000Z",
    "checkOutTime": "2024-11-07T17:15:00.000Z",
    "createdAt": "2024-11-07T09:30:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f771",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-11-09T09:10:00.000Z",
    "checkOutTime": "2024-11-09T17:10:00.000Z",
    "createdAt": "2024-11-09T09:10:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f772",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-11-11T09:00:00.000Z",
    "checkOutTime": "2024-11-11T17:05:00.000Z",
    "createdAt": "2024-11-11T09:00:00.000Z",
    "__v": 0,
    "screenRecording": ""
  },
  {
    "_id": "6651b2334af5388b51e7f773",
    "employeeId": "6651749261343f42c521b70f",
    "checkInTime": "2024-11-13T09:30:00.000Z",
    "checkOutTime": "2024-11-13T17:15:00.000Z",
    "createdAt": "2024-11-13T09:30:00.000Z",
    "__v": 0,
    "screenRecording": ""
  }
]


const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );
  const [tasks, setTasks] = useState([]);
  const [workSessions, setWorkSessions] = useState([]);
  const [presenceDates, setPresenceDates] = useState(new Set());

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
        console.log('Work sessions', response.data)
        //  setWorkSessions(response.data || []);
        setWorkSessions(DUMMY_ATTENDENCE);

        // Extract unique presence dates
        const dates = new Set(
          DUMMY_ATTENDENCE.map((session) => new Date(session.checkInTime).toDateString())
        );
        setPresenceDates(dates);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployee();
    fetchTasks();
    fetchWorkSessions();
    // }, [employee?._id, axiosInstance]);
  }, []);
  const isPresentDate = (date) =>
    presenceDates.has(date.toDateString());


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

  const getCurrentTask = () => {
    return tasks.find((task) => task.task.status === "In Progress");
  };

  const getRecentWorkSessions = () => {
    return workSessions.slice(0, 3);
  };

  const countTasksByStatus = (status) => {
    return tasks.filter((task) => task?.task?.status === status).length;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setTaskModalOpened(true);
  };

  const isTaskDate = (date) => {
    return tasks.some(
      (task) => new Date(task?.task?.createdAt).toDateString() === date.toDateString()
    );
  };

  const isAttendanceDate = (date) => {
    return workSessions.some(
      (session) => new Date(session.checkInTime).toDateString() === date.toDateString()
    );
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (task?.task?.createdAt && date) {
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


  // Attendance data (for demo purposes)
  const totalDays = 30; // Example of total number of days in the month
  const presentDays = 20; // Example of present days
  const absentDays = 10; // Example of absent days
  const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(2);

  const holidays = [
    { name: "Christmas Day", date: "25th December 2024" },
    { name: "New Year's Day", date: "1st January 2025" },
    { name: "Independence Day", date: "4th July 2025" },
  ];
  return (
    <Container p="sm">
      <Grid gutter={'xl'}>
        <Grid grow >
          {/* Welcome Message */}
          <Grid.Col span={8} >
            <GridCard
              shadow="md"
              padding="xl"
              radius="md"
              style={{
                backgroundColor: "#f8fbff",
                border: "1px solid #dce6f1",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                height: "100%",
              }}
            >
              <Group
                position="center"
                direction="column"
                spacing="xs"
                style={{
                  textAlign: "center",
                }}
              >
                <Title
                  order={2}
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#1e3a5f",
                  }}
                >
                  {getGreeting()}, {employee.name.split(" ")[0]}!
                </Title>

                <Text
                  size="md"
                  style={{
                    color: "#4a627b",
                  }}
                >
                  We’re thrilled to have you back. Let’s make today a great one!
                </Text>

                <Divider
                  size="sm"
                  style={{
                    margin: "1rem 0",
                    width: "50%",
                    backgroundColor: "#cfd8dc",
                  }}
                />

                <Text
                  size="sm"
                  style={{
                    fontStyle: "italic",
                    color: "#7d8fa4",
                  }}
                >
                  "Success is not the key to happiness. Happiness is the key to success."
                </Text>
              </Group>
            </GridCard>
          </Grid.Col>

          {/* Clock */}
          <Grid.Col span={4} >
            <GridCard
              shadow="md"
              padding="xl"
              radius="md"
              style={{
                backgroundColor: "#f8fbff",
                border: "1px solid #dce6f1",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                height: "100%",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AnalogClock />
            </GridCard>


          </Grid.Col>
        </Grid>
        <Grid gutter={'xl'} mt={'lg'} >
          {/* Attendence summary */}
          <Grid.Col span={3} >
            <GridCard
              shadow="md"
              padding="xl"
              radius="md"
              style={{
                backgroundColor: "#f8fbff",
                border: "1px solid #dce6f1",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",

              }}
            >
              <AttendanceSummary
                totalDays={30}
                presentDays={25}
                absentDays={5}
                attendancePercentage={83.3}
              />


            </GridCard>
          </Grid.Col>

          {/* Calendar */}
          <Grid.Col span={6} >
            <GridCard
              shadow="md"
              padding="xl"
              radius="md"
              style={{
                backgroundColor: "#f8fbff",
                border: "1px solid #dce6f1",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",

                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
              }}
            >
              <Title order={3} style={{ textAlign: "center", marginBottom: "1rem", color: "#1e3a5f" }}>
                My Attendance
              </Title>
              <Calendar
                size="lg"
                value={selectedDate}
                onChange={setSelectedDate}
                renderDay={(date) => {
                  const isPresent = isPresentDate(date); // Replace this with your logic to check for presence
                  const isPast = date < new Date(); // Check if the date is in the past
                  const tileStyles = {
                    position: "relative",
                    textAlign: "center",
                    padding: "0.6rem",
                    borderRadius: "4px",
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    fontWeight: 600,
                  };
                  if (isPresent) {
                    tileStyles.backgroundColor = "#a8d5ba"; // Soft green shade for presence
                    tileStyles.color = "#2a6d4f"; // Darker text for better contrast
                    tileStyles.border = "3px solid #4CAF50"; // Green border for presence
                  } else if (isPast) {
                    tileStyles.backgroundColor = "#f8d7da"; // Light red shade for absence
                    tileStyles.color = "#721c24"; // Darker text for absence
                    tileStyles.border = "3px solid #f5c6cb"; // Light red border for absence
                  }
                  return (
                    <div style={tileStyles}>
                      <div style={{ width: '1.5rem', margin: '0 auto' }}>{date.getDate()}</div>
                    </div>
                  );
                }}
              />
            </GridCard>


          </Grid.Col>

          {/* Upcoming Holidays  */}
          <Grid.Col span={3}>
            <GridCard
              shadow="md"
              padding="xl"

              radius="md"
              style={{
                backgroundColor: "#f8fbff",
                border: "1px solid #dce6f1",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",

                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
              }}
            >
              <Title order={3} style={{ textAlign: "center", marginBottom: "1rem", color: "#1e3a5f" }}>
                Upcoming Holidays
              </Title>
              {holidays.length > 0 ? (
                <div
                  style={{
                    maxHeight: "60%", // Adjust height to show 2 holidays
                    overflowY: "auto", // Make it scrollable if more than 2 holidays

                  }}>



                  <Stack spacing="sm">
                    {holidays.map((holiday, index) => (
                      <GridCard
                        key={index}
                        shadow="sm"
                        padding="md"
                        radius="sm"
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #dce6f1",
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        {/* Optional Holiday Icon */}
                        <div
                          style={{
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "50%",
                            backgroundColor: "#eaf4ff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          📅
                        </div>

                        {/* Holiday Details */}
                        <div style={{ flex: 1 }}>
                          <Text
                            size="sm"
                            style={{ fontWeight: 600, color: "#1e3a5f" }}
                          >
                            {holiday.name}
                          </Text>
                          <Text size="xs" style={{ color: "#4a627b" }}>
                            {holiday.date}
                          </Text>
                        </div>
                      </GridCard>
                    ))}
                  </Stack>
                </div>
              ) : (
                <Text
                  size="sm"
                  style={{
                    textAlign: "center",
                    color: "#4a627b",
                    marginTop: "1rem",
                  }}
                >
                  No upcoming holidays!
                </Text>
              )}
            </GridCard>
          </Grid.Col>
        </Grid>


        <Grid  gutter={'xl'} mt={'lg'}>
  {/* Task Status */}
  <Grid.Col span={5}>
    <GridCard shadow="lg" padding="lg">
      <Title order={3} style={{ textAlign: 'center', color: '#1e3a5f' }}>
        Task Status
      </Title>
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
              backgroundColor: ["#a8d5e2", "#ffffb3", "#a8e6cf"], // Soft blues, yellows, and greens
              hoverBackgroundColor: ["#85c1e9", "#fefcbf", "#7ccd7c"], // Slightly darker shades for hover
              borderWidth: 0,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                boxWidth: 20,
                padding: 15,
                font: {
                  size: 14,
                  family: "Arial, sans-serif",
                  weight: "bold",
                },
                color: '#333',
              },
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function (context) {
                  let percentage = Math.round((context.raw / context.dataset._meta[Object.keys(context.dataset._meta)[0]].total) * 100);
                  return `${context.label}: ${percentage}% (${context.raw} tasks)`;
                },
              },
            },
          },
          cutout: "70%",
          responsive: true,
          animation: {
            animateScale: true,
            animateRotate: true,
          },
          maintainAspectRatio: false,
          elements: {
            arc: {
              borderWidth: 0,
            },
          },
        }}
        style={{
          maxHeight: "300px",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
    </GridCard>
  </Grid.Col>

  {/* Current Task */}
  <Grid.Col span={3}>
    <GridCard shadow="sm" padding="lg">
      <Title order={3} style={{
        textAlign: 'center',
        color: '#4a5568',
        marginBottom: '1rem'
      }}>
        Current Task
      </Title>

      {currentTask ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          {/* Task Name */}
          <Text style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2b6cb0',
            marginBottom: '15px',
            textTransform: 'capitalize'
          }}>
            {currentTask.task.taskName}
          </Text>

          {/* Priority Badge */}
          <div style={{
            marginBottom: '15px',
            padding: '8px 18px',
            borderRadius: '30px',
            backgroundColor: getPriorityColor(currentTask.task.priority),
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'inline-block',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            Priority: {currentTask.task.priority}
          </div>

          {/* Description */}
          <Text style={{
            fontSize: '16px',
            color: '#2d3748',
            fontStyle: 'italic',
            marginBottom: '20px',
            maxWidth: '90%',
            lineHeight: '1.6',
            textAlign: 'justify',
            marginTop: '10px',
          }}>
            {currentTask.description}
          </Text>

          {/* Assigned Date */}
          <div style={{
            fontSize: '14px',
            color: '#718096',
            fontWeight: '600',
            marginTop: '10px',
            textTransform: 'uppercase'
          }}>
            Assigned on: <span style={{ fontWeight: 'bold' }}>
              {new Date(currentTask.task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ) : (
        <Text style={{
          fontSize: '16px',
          color: '#e53e3e',
          fontStyle: 'italic'
        }}>
          No current task assigned.
        </Text>
      )}
    </GridCard>
  </Grid.Col>

  {/* Pending Tasks */}
  <Grid.Col span={4}>
    <GridCard shadow="sm" padding="lg">
      <Title order={3} style={{
        textAlign: 'center',
        color: '#4a5568',
        marginBottom: '1rem'
      }}>
        Pending Tasks
      </Title>

      <List style={{
        listStyleType: 'none',
        paddingLeft: '0',
        marginTop: '10px',
        overflow:'auto'
      }}>
        {tasks
          .filter((task) => task?.task?.status === "To Do")
          .slice(0, 5)
          .map((task) => (
            <List.Item key={task._id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              {/* Task Name */}
              <Text style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#2b6cb0',
                marginBottom: '8px',
                textTransform: 'capitalize',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {task.task.taskName}
              </Text>

              {/* Priority Badge */}
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '30px',
                backgroundColor: getPriorityColor(task.task.priority),
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
              }}>
                Priority: {task.task.priority}
              </div>
            </List.Item>
          ))}
      </List>
    </GridCard>
  </Grid.Col>
</Grid>



<Grid.Col span={6}>
  <GridCard shadow="sm" padding="lg">
    <Title order={3} style={{ textAlign: 'center', color: '#4a5568', marginBottom: '1rem' }}>
      Recent Work Sessions
    </Title>

    <Timeline active={recentWorkSessions.length} style={{ marginTop: '10px'}}>
      {recentWorkSessions.map((session) => {
        const checkInDate = new Date(session.checkInTime);
        const checkOutDate = new Date(session.checkOutTime);
        const now = new Date();
        const timeDifference = now - checkInDate;

        // Helper function to format the date
        const formatSessionDate = (date) => {
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          return date.toLocaleDateString('en-US', options);
        };

        // Calculate if the session is today, yesterday, or older
        let sessionDateLabel = '';
        if (timeDifference < 24 * 60 * 60 * 1000) {
          sessionDateLabel = 'Today'; // Less than 24 hours ago
        } else if (timeDifference < 48 * 60 * 60 * 1000) {
          sessionDateLabel = 'Yesterday'; // Less than 48 hours ago
        } else {
          sessionDateLabel = formatSessionDate(checkInDate); // Actual date
        }

        return (
          <div>
          <Timeline.Item
            key={session._id}
            title={`Checked in at ${checkInDate.toLocaleTimeString()}`}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              padding: '1rem',
            }}
          >
            {/* Content container to center the text */}
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              <Text size="sm" style={{ color: '#4a5568', fontWeight: 'normal' }}>
                Checked out at{" "}
                <span style={{ fontWeight: 'bold', color: '#2b6cb0' }}>
                  {checkOutDate.toLocaleTimeString()}
                </span>
              </Text>
              <Text size="xs" style={{ color: '#718096', fontWeight: '600', marginTop: '5px' }}>
                {sessionDateLabel}
              </Text>
            </div>
          </Timeline.Item>
          </div>
        );
      })}
    </Timeline>
  </GridCard>
</Grid.Col>





      

        {/* Notifications */}
        <Grid.Col span={6}>
          <GridCard shadow="sm" padding="lg">
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
          </GridCard>
        </Grid.Col>

        {/* Detailed Tasks and Attendance for Selected Date */}
        <Grid.Col span={12}>
          <GridCard shadow="sm" padding="lg">
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
          </GridCard>
        </Grid.Col>

        {/* Quick Links */}
        <Grid.Col span={12}>
          <GridCard shadow="sm" padding="lg">
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
          </GridCard>
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
