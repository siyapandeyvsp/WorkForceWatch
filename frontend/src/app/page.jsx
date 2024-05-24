"use client";
import { Container, Text, Button, Group, Stack, Image, rem, SegmentedControl } from "@mantine/core";
import { IconUser, IconBriefcase } from '@tabler/icons-react';
import classes from "./page.module.css";
import Login from "./(main)/login/page";
import EmployeeLogin from "./employee-login/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';

export default function Home() {
  const iconStyle = { width: rem(20), height: rem(20) };
  const [selected, setSelected] = useState('User Login');

  const handleSelectionChange = (value) => {
    setSelected(value);
  };

  return (
    <div>
      <Container className={classes.wrapper} fluid p={70}>
        <Group fluid justify="center" gap={200} >
          <Stack  >
            <h1 className={classes.title}>
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                inherit
              >
                WorkForce Watch
              </Text>{" "}
            </h1>

            <Image src={"wfh.jpg"} w={500} />
            </Stack>

            <Stack>
            <SegmentedControl
              data={['User Login', 'Employee Login']}
              color="blue"
              transitionDuration={500}
              transitionTimingFunction="linear"
              value={selected}
              onChange={handleSelectionChange}
            />

            {selected === 'User Login' && <Login />}
            {selected === 'Employee Login' && <EmployeeLogin />}
            </Stack>
        </Group>
      </Container>
    </div>
  );
}