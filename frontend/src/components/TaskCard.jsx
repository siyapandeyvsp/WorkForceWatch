// TaskCard.jsx
import { Badge, Text, Card, Button } from "@mantine/core";
import React from "react";

const getBadgeColor = (status) => {
  switch (status) {
    case "In Progress":
      return "blue";
    case "Completed":
      return "green";
    case "Pending":
      return "yellow";
    default:
      return "gray";
  }
};

const TaskCard = ({ task, isAssigning, assignfunction }) => (
  <Card
    padding="md"
    shadow="xs"
    style={{
      height: "250px",
      marginBottom: "20px",
      borderLeft: `5px solid ${getBadgeColor(task.status)}`,
    }}
  >
    <Text weight={700} style={{ marginBottom: "10px" }}>
      {task.taskName}
    </Text>
    <Text size="sm" color="dimmed" style={{ marginBottom: "10px" }}>
      {task.description}
    </Text>
    <Text size="xs" color="gray" style={{ marginBottom: "5px" }}>
      Assigned to: {task.assignedTo}
    </Text>
    <Badge color={getBadgeColor(task.status)} style={{ marginBottom: "5px" }}>
      Status: {task.status}
    </Badge>
    <Text size="xs" color="gray" style={{ marginBottom: "5px" }}>
      Priority: {task.priority}
    </Text>
     {task.assigned?<Badge color="green">Assigned</Badge>:<Badge color="red">Not Assigned</Badge>}
    {isAssigning && (
      <Button onClick={assignfunction}>Assign to Employee</Button>
    )}
  </Card>
);

export default TaskCard;
