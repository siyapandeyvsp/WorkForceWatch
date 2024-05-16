"use client";
import { Container, Title } from '@mantine/core';
import React from 'react'
const employee= {name: 'Lola',
designation: 'HR',
email: 'lola@gmail.com',
avatar: 'https://img.freepik.com/premium-photo/minimal-japanese-kawaii-gamer-girl-chibi-anime-vector-art-sticker-with-clean-bold-line-cute-simple_655090-9168.jpg'
}
const EmployeeDashboard = () => {
    console.log("user",sessionStorage.getItem('user'));
  return (
    <Container>
        <Title ta='center'>Welcome {employee.name}</Title>
    <h1>Tasks </h1>
    </Container>
  )
}

export default EmployeeDashboard