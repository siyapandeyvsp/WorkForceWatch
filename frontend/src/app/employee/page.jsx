"use client";
import EmployeeTasks from '@/components/EmployeeTasks';
import WorkSessionData from '@/components/WorkSessionData';
import { Container, Title } from '@mantine/core';
import React, { useState } from 'react'
const employee= {name: 'Lola',
designation: 'HR',
email: 'lola@gmail.com',
avatar: 'https://img.freepik.com/premium-photo/minimal-japanese-kawaii-gamer-girl-chibi-anime-vector-art-sticker-with-clean-bold-line-cute-simple_655090-9168.jpg'
}
const EmployeeDashboard = () => {
  const [currentUser,setCurrentUser]=useState(sessionStorage.getItem('employee'))
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
 
  console.log("user",sessionStorage.getItem('employee'));
  return (
    <Container>
        <Title ta='center'>Welcome {currentUser.name}</Title>

  
    </Container>
  )
}

export default EmployeeDashboard