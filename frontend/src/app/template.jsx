"use client";

import { AppProvider } from "@/context/AppContext";
import { TaskProvider } from "@/context/TaskContext";
import { WorkSessionProvider } from "@/context/WorkSessionContext";
import App from "next/app";
import React from "react";
import "@mantine/dates/styles.css";
const Template = ({ children }) => {
  return (
    <AppProvider>
      <WorkSessionProvider>
        <TaskProvider>{children}</TaskProvider>
      </WorkSessionProvider>
    </AppProvider>
  );
};

export default Template;
