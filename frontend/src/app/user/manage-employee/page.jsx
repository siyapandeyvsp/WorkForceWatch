"use client";
import React from "react";
import { Paper, Button, Container, Grid } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { Drawer } from '@mantine/core';
import AddUserForm from "./AddUserForm";
import { UsersTable } from "./UserTable";
const ManageEmployee = () => {
    const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container>
      <Paper padding="md" shadow="xs">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
          <Drawer opened={opened} onClose={close} title="Add User">
        <AddUserForm/>
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
            
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Button color="teal" onClick={() => console.log("Update Employee")}>
              Update Employee
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Button color="red" onClick={() => console.log("Delete Employee")}>
              Delete Employee
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper padding="md" shadow="xs" mt="md">
        <UsersTable/>
        </Paper>
    </Container>
  );
};

export default ManageEmployee;
