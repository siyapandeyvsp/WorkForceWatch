"use client";
import React from "react";
import { Paper, Button, Container, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";

const ManageTasks = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Container>
      <Paper padding="md" shadow="xs">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Modal opened={opened} onClose={close} title="Add Task">
              <AddTaskForm />
            </Modal>

            <Button onClick={open}>Add Task</Button>
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper padding="md" shadow="xs" mt="md">
        <TaskList />
      </Paper>
    </Container>
  );
};

export default ManageTasks;
