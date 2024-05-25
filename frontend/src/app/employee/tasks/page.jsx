"use client";
import React, { useEffect, useState } from 'react';
import { Paper, Stack ,Image , TextInput, Avatar, Button, Container, Tabs, Group, Grid, Notification, Text } from '@mantine/core';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';

import useAppContext from "@/context/AppContext";
import TaskCard from '@/components/TaskCard';

const EmployeeTasksPage = () => {
const [employee,setEmployee]=useState(JSON.parse(sessionStorage.getItem('employee')))
const [tasks,setTasks]=useState([])
const { axiosInstance } = useAppContext();


    useEffect(() => {
        const fetchTasks = async () => {
          const response = await axiosInstance.get(`/assignment/getbyemployee/${employee._id}`);
          setTasks(response.data || []);
        };
      
        fetchTasks();
      }, [tasks]);  

  return (
    <Container>
        <Paper>
            <Text size='xl' ta="center">Assigned Tasks </Text>
            {
                tasks.map((task) => (
                    <TaskCard task={task} />
                ))
            }
        </Paper>
    </Container>
  )
}

export default EmployeeTasksPage
