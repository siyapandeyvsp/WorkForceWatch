"use client";

import React from "react";
import {
  Text,
  Image,
  TextInput,
  Checkbox,
  Button,
  Group,
  FileInput,
  PasswordInput,
  Title,
  Paper,
  Container,
  Grid,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import classes from "./Signup.module.css";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      description: "",
      logo: null,
      cover: null,
      address: "",
      password: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      termsOfService: (value) => (value ? null : "You must agree to the terms"),
    },
  });

  const signupSubmit = (values) => {
    console.log(values);
    fetch("http://localhost:5000/user/add", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          notifications.show({
            title: "Success",
            message: "User registered successfully",
          });
          router.push("/");
        } else {
          notifications.show({
            title: "Error",
            message: "Failed to register user",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Error",
          message: "Failed to register user",
        });
      });
  };

  return (
    <div className={classes.signupPage}>
      <Container size="xl" className={classes.wrapper} fluid p={10}>
        <div className={classes.centerContent}>
          <Group grow align="center" spacing="3xl">
            <Stack className={classes.leftPane}>
              <h1 className={classes.title1}>
                <Text
                  component="span"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                  inherit
                >
                  WorkForce Watch
                </Text>
              </h1>
              <Image src="/wfh.jpg" w={600} />
            </Stack>
            <Stack className={classes.rightPane}>
              <Paper
                radius="md"
                p="xl"
                withBorder
                className={classes.scrollablePaper}
              >
                <Title
                  order={2}
                  align="center"
                  className={classes.title}
                  mt="md"
                  mb="xl"
                >
                  Create an Account
                </Title>
                <form onSubmit={form.onSubmit(signupSubmit)}>
                  <Grid gutter="md">
                    <Grid.Col span={12}>
                      <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Enter your name"
                        {...form.getInputProps("name")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="your@email.com"
                        {...form.getInputProps("email")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <PasswordInput
                        withAsterisk
                        label="Password"
                        placeholder="Password"
                        {...form.getInputProps("password")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        withAsterisk
                        label="Description"
                        placeholder="Enter a description"
                        {...form.getInputProps("description")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Address"
                        placeholder="Enter your address"
                        {...form.getInputProps("address")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FileInput
                        label="Logo"
                        placeholder="Upload your logo"
                        {...form.getInputProps("logo")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FileInput
                        label="Cover"
                        placeholder="Upload your cover image"
                        {...form.getInputProps("cover")}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Checkbox
                        mt="md"
                        label="I agree to the terms and conditions"
                        {...form.getInputProps("termsOfService", {
                          type: "checkbox",
                        })}
                      />
                    </Grid.Col>
                  </Grid>
                  <Group position="center" mt="xl">
                    <Button type="submit" size="lg">
                      Submit
                    </Button>
                  </Group>
                </form>
              </Paper>
            </Stack>
          </Group>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
