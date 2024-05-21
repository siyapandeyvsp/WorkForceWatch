"use client";
import {
  AppShell,
  Burger,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
} from "@mantine/core";
import { Switch, useMantineTheme, rem } from "@mantine/core";
import {
  IconCheck,
  IconLogin,
  IconLogout,
  IconMoonStars,
  IconSun,
  IconX,
} from "@tabler/icons-react";

import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { NavbarSimple } from "../(main)/navbar"; // import the NavbarSimple component
import { useEffect, useState } from "react";
import useWorkSessionContext from "@/context/WorkSessionContext";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  const [checked, setChecked] = useState(false);
  const [timer, setTimer] = useState(0);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [isVideoRecording, setVideoRecording] = useState(false);
  const [isScreenRecording, setScreenRecording] = useState(false);

  const {
    createNewWorkession,
    checkOut,
    startScreenRecording,
    stopScreenRecording,
    startVideoRecording,
    stopVideoRecording
  } = useWorkSessionContext();

  useEffect(() => {
    let interval = null;
    if (checked) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!checked && timer !== 0) {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [checked, timer]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  useEffect(() => {
    if (isScreenRecording) {
      startScreenRecording();
    } else {
      stopScreenRecording();
    }
  }, [isScreenRecording]);

  useEffect(() => {
    if (isVideoRecording) {
      startVideoRecording();
    } else {
      stopVideoRecording();
    }
  }, [isVideoRecording]);

  const handleCheckChange = (event) => {
    setChecked(event.currentTarget.checked);
    if (event.currentTarget.checked) {
      // create new check in / session record
      createNewWorkession();
      openModal();
    } else {
      // update checkout time and remove current session record
      // closeModal();
      checkOut();
      setVideoRecording(false);
      setScreenRecording(false);
    }
  };
  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconMoonStars
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />

          <Group>
            <Switch
              size="md"
              color="dark.4"
              onLabel={sunIcon}
              offLabel={moonIcon}
            />
            <Switch
              checked={checked}
              // onChange={(event) => setChecked(event.currentTarget.checked)}
              onChange={handleCheckChange}
              color="teal"
              size="xl"
              onLabel="Check out"
              offLabel="Check in"
              label=""
              thumbIcon={
                checked ? (
                  <IconLogin
                    style={{ width: rem(12), height: rem(12) }}
                    color={theme.colors.teal[6]}
                    stroke={3}
                  />
                ) : (
                  <IconLogout
                    style={{ width: rem(12), height: rem(12) }}
                    color={theme.colors.red[6]}
                    stroke={3}
                  />
                )
              }
            />
            {checked && <p>Working since : {formatTime(timer)}</p>}{" "}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavbarSimple userType="employee" />{" "}
        {/* use the NavbarSimple component */}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title="Recording Options"
      >
        <Paper p={16} shadow="xs" style={{ width: 400 }}>
          <Group>
            <Switch
              checked={isVideoRecording}
              onChange={(event) => {
                setVideoRecording(event.currentTarget.checked);
              }}
              label="Start video recording"
            />
            <Switch
              checked={isScreenRecording}
              onChange={(event) => {
                setScreenRecording(event.currentTarget.checked);
              }}
              label="Start screen recording"
            />
          </Group>
        </Paper>
      </Modal>
    </AppShell>
  );
}
