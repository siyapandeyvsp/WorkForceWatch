"use client";
import EmployeeTasks from '@/components/EmployeeTasks';
import WorkSessionData from '@/components/WorkSessionData';
import { Container, Title } from '@mantine/core';
import React, { useState } from 'react'

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(JSON.parse(sessionStorage.getItem('employee')));
console.log("Welcome to employee dashboard",employee)
  const [tasks, setTasks] = useState([]);

 const fetchAssignmentsOfEmployee = () => {
  const response = fetch(`http://localhost:5000/assignment/getbyemployee/${currentUser._id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': currentUser.token
    }
  })
}
 

  return (
    <Container>
        <Title ta='center'>Welcome {employee.name}</Title>

  
    </Container>
  )
}

export default EmployeeDashboard