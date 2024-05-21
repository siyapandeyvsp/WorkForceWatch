"use client";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useForm } from "@mantine/form";
import React from "react";
import  useAppContext  from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
const EmployeeLogin = () => {
const router=useRouter();
  const {axiosInstance}= useAppContext();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6
          ? "Password should be at least 6 characters long"
          : null,
    },
  });

  const loginSubmit = (values) => {
    console.log(values);
    axiosInstance.post('/employee/authenticate', JSON.stringify(values),{
      headers:{ 
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log(response.status);
      if(response.status === 200){
        console.log(response.data)
        console.log("Login successful");
        notifications.show({title:'Success', message:'Login Successfull'})
        sessionStorage.setItem('employee', JSON.stringify(response.data));
        router.push('/employee/profile')
      }
      
    }).catch((err) => {
      console.log(err);
      notifications.show({ title: 'Error', message: err.message });

    });
    
  };
  return (
    <Container fluid  size={500}>
       <h1 className={classes.title}>
              <Text
               
                variant="gradient"
                ta="center"
                gradient={{ from: "blue", to: "cyan" }}
                inherit
              >
             Employee Login
              </Text>{" "}
            </h1>
      {/* <Title ta="center" className={classes.title}>
        Welcome back!
      </Title> */}
    <Text c="dimmed" size="sm" ta="center" mt={5}>
  Do not have an account yet?{" "}
  <Link href="/signup">
    <Anchor size="sm" component="button">
      Create account
    </Anchor>
  </Link>
</Text>
      <form onSubmit={form.onSubmit(loginSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
};

export default EmployeeLogin;
