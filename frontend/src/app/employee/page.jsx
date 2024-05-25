"use client";
import EmployeeTasks from '@/components/EmployeeTasks';
import WorkSessionData from '@/components/WorkSessionData';
import { Container, Title } from '@mantine/core';
import React, { useState } from 'react'

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(JSON.parse(sessionStorage.getItem('employee')));
console.log("Welcome to employee dashboard",employee)
  const [tasks, setTasks] = useState([]);

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

  return (
    <Container>
        <Title ta='center'>Welcome {employee.name}</Title>

  
    </Container>
  )
}

export default EmployeeDashboard