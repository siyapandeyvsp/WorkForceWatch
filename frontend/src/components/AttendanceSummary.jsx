import { Card, Grid, Title, Text, Stack } from "@mantine/core";
import { Pie } from "react-chartjs-2";
import React from "react";

// Add Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function AttendanceSummary({ totalDays, presentDays, absentDays, attendancePercentage }) {
  // Calculate data for the chart
  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: [presentDays, absentDays],
        backgroundColor: ["#85D5B5", "#FF6B6B"], // Soft green and coral red
        borderColor: ["#85D5B5", "#FF6B6B"],
        borderWidth: 2,
        hoverBackgroundColor: ["#6CBF9E", "#FF5252"],
      },
    ],
  };

  return (
   <>

      {/* Header */}
      <Title
        order={3}
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          color: "#10375C", // Deep blue
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Attendance Summary
      </Title>

      {/* Text Data */}
      <Stack spacing="xs" style={{ marginBottom: "1.5rem" }}>
        <Text
          size="md"
          style={{
            color: "#3A6073",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          Total Days: <b>{totalDays}</b>
        </Text>
        <Text
          size="md"
          style={{
            color: "#3A6073",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          Present Days: <b>{presentDays}</b>
        </Text>
        <Text
          size="md"
          style={{
            color: "#3A6073",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          Absent Days: <b>{absentDays}</b>
        </Text>
        <Text
          size="md"
          style={{
            color: "#3A6073",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          Attendance: <b>{attendancePercentage}%</b>
        </Text>
      </Stack>

      {/* Chart */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          borderRadius: "10px",
          background: "#FFFFFF", // White card for contrast
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ width: "200px", height: "200px" }}>
          <Pie data={chartData} />
        </div>
        </div>
        </>

  );
}

export default AttendanceSummary;
