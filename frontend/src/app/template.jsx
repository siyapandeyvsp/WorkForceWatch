"use client";

import { AppProvider } from "@/context/AppContext";
import { TaskProvider } from "@/context/TaskContext";
import App from "next/app";
import React from "react";

const Template = ({ children }) => {
  return (
    <AppProvider>
      <TaskProvider>{children}</TaskProvider>
    </AppProvider>
  );
};

export default Template;
