import { Container, Text, Button, Group, Stack, Image } from "@mantine/core";
// import { GithubIcon } from '@mantinex/dev-icons';
import classes from "./page.module.css";
import { Icon3dRotate } from "@tabler/icons-react";
import Login from "./(main)/login/page";
import EmployeeLogin from "./employee-login/page";
export default function Home() {
  return (
    <div>
      <Container className={classes.wrapper} fluid p={70}>
        <Group fluid>
          <Stack>
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

            <Group className={classes.controls}>
              {/* <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Get started
          </Button>

          <Button
            component="a"
            href="https://github.com/mantinedev/mantine"
            size="xl"
            variant="default"
            className={classes.control}
            leftSection={<Icon3dRotate size={20} />}
          >
            GitHub
          </Button>
           */}
            </Group>
          </Stack>
          <Login />
          <EmployeeLogin/>
        </Group>
      </Container>
    </div>
  );
}
