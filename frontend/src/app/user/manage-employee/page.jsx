"use client";
import React from "react";
import { Paper, Button, Container, Grid, Group, Drawer } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import AddUserForm from "./AddUserForm";
import { UsersTable } from "./UserTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const ManageEmployee = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container size="lg" padding="md">
      <Paper padding="md" shadow="xs">
        <Group position="right" mb="md">
          <Button onClick={open} leftIcon={<FontAwesomeIcon icon={faAdd} />} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
            Add Employee
          </Button>
        </Group>
        <Drawer opened={opened} onClose={close} title="Add User" padding="xl" size="lg">
          <AddUserForm />
        </Drawer>
      </Paper>
      <Paper padding="md" shadow="xs" mt="md">
        <UsersTable />
      </Paper>
    </Container>
  );
};

export default ManageEmployee;