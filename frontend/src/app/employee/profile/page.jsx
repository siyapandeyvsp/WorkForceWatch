"use client";
import React, { useState } from 'react';
import { Paper, TextInput, Avatar, Button, Container, Tabs } from '@mantine/core';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(JSON.parse(sessionStorage.getItem('employee')));  console.log("currentEmployee is ",sessionStorage.getItem('employee'));
 
  // const [employee, setEmployee] = useState({
  //   name: 'Lola',
  //   designation: 'HR',
  //   email: 'lola@gmail.com',
  //   avatar: 'https://img.freepik.com/premium-photo/minimal-japanese-kawaii-gamer-girl-chibi-anime-vector-art-sticker-with-clean-bold-line-cute-simple_655090-9168.jpg'
  // });

  const handleInputChange = (event) => {
    setEmployee({
      ...employee,
      [event.target.name]: event.target.value
    });
  };

  return (
   <Container  p='sm'>
    <Tabs defaultValue='General'>
     <Tabs.List>
      <Tabs.Tab value="General">General</Tabs.Tab>
      <Tabs.Tab value="Contact">Contact</Tabs.Tab>
      <Tabs.Tab value="Qualification">Qualification</Tabs.Tab>
      <Tabs.Tab value="Bank">Bank</Tabs.Tab>
      <Tabs.Tab value="Payroll">Payroll</Tabs.Tab>

     </Tabs.List>
      <Tabs.Panel value="General">
      <Paper p="sm" shadow="xs" w={500}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar src={employee.avatar} w={200} h={200}  />
        </div>
        <TextInput
          label="Name"
          placeholder="Enter name"
          value={employee.name}
          name="name"
          onChange={handleInputChange}
        />
        <TextInput
          label="Designation"
          placeholder="Enter designation"
          value={employee.designation}
          name="designation"
          onChange={handleInputChange}
        />
        <TextInput
          label="Email"
          placeholder="Enter email"
          value={employee.email}
          name="email"
          onChange={handleInputChange}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button color="blue" variant="outline">Update Profile</Button>
        </div>
      </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="Contact">
      <Paper p="sm" shadow="xs" w={500}>
        <TextInput
          label="Phone"
          placeholder="Enter phone"
          value={employee.phone}
          name="phone"
          onChange={handleInputChange}
        />
        <TextInput
          label="Address"
          placeholder="Enter address"
          value={employee.address}
          name="address"
          onChange={handleInputChange}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button color="blue" variant="outline">Update Contact</Button>
        </div>
      </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="Qualification">
      <Paper p="sm" shadow="xs" w={500}>
        <TextInput
          label="Degree"
          placeholder="Enter degree"
          value={employee.degree}
          name="degree"
          onChange={handleInputChange}
        />
        <TextInput
          label="Institution"
          placeholder="Enter institution"
          value={employee.institution}
          name="institution"
          onChange={handleInputChange}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button color="blue" variant="outline">Update Qualification</Button>
        </div>
      </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="Bank">
      <Paper p="sm" shadow="xs" w={500}>
        <TextInput
          label="Account Number"
          placeholder="Enter account number"
          value={employee.accountNumber}
          name="accountNumber"
          onChange={handleInputChange}
        />
        <TextInput
          label="Bank Name"
          placeholder="Enter bank name"
          value={employee.bankName}
          name="bankName"
          onChange={handleInputChange}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button color="blue" variant="outline">Update Bank</Button>
        </div>
      </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="Payroll">
      <Paper p="sm" shadow="xs" w={500}>
        <TextInput
          label="Salary"
          placeholder="Enter salary"
          value={employee.salary}
          name="salary"
          onChange={handleInputChange}
        />
        <TextInput
          label="Tax"
          placeholder="Enter tax"
          value={employee.tax}
          name="tax"
          onChange={handleInputChange}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button color="blue" variant="outline">Update Payroll</Button>
        </div>
      </Paper>
      </Tabs.Panel>

     
     </Tabs>
      </Container>
  );
};

export default EmployeeProfile;