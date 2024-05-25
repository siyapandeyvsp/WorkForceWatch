"use client";
import React from "react";
import { Paper, Button, Container, Grid } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { Drawer } from '@mantine/core';
import AddUserForm from "./AddUserForm";
import { UsersTable } from "./UserTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
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

      <Button m={5} onClick={open}>Add Employee
      <FontAwesomeIcon icon={faAdd} style={{font:'bold', marginLeft:'1rem'}}/>
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
