// TaskCard.jsx
import { Badge, Text, Card, Button, Grid, Tooltip, Select, TextInput } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";

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

const TaskCard = ({ task, isAssigning, assignfunction, deletefunction, updatefunction }) => {
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [description, setDescription] = useState(task.description);

  useEffect(() => {
    if (status !== task.status || priority !== task.priority || description !== task.description) {
      updatefunction(task._id, status, priority, description);
    }
  }, [status, priority, description]);

  return (
    <Card
    padding="md"
    shadow="xs"
    style={{
      minHeight: "250px",
      marginBottom: "20px",
      borderLeft: `5px solid ${getBadgeColor(status)}`,
    }}
  >
      <Grid gutter="xs" style={{ marginBottom: "10px" }}>
        <Grid.Col span={12} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tooltip label={task.taskName}>
            <Text weight={700} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "85%" }}>
              {task.taskName}
            </Text>
          </Tooltip>
          <Button onClick={deletefunction} color="red" variant="light">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Grid.Col>
      </Grid>
      <TextInput
  multiline
  label="Description"
  defaultValue={description}
  onKeyPress={(event) => {
    if (event.key === 'Enter') {
      setDescription(event.target.value);
    }
  }}
  style={{ marginBottom: "10px" }}
/>
      <Text size="xs" color="gray" style={{ marginBottom: "5px" }}>
        Assigned to: {task.assignedTo}
      </Text>
      <Select
        data={["To Do", "In Progress", "Completed"]}
        value={status}
        onChange={setStatus}
        label="Status"
        style={{ marginBottom: "5px" }}
      />
      <Select
        data={["High", "Medium", "Low"]}
        value={priority}
        onChange={setPriority}
        label="Priority"
        style={{ marginBottom: "5px" }}
      />
      {task.assigned?<Badge color="green">Assigned</Badge>:<Badge color="red">Not Assigned</Badge>}
      {isAssigning && (
        <Button onClick={assignfunction}>Assign to Employee</Button>
      )}
    </Card>
  );
};

export default TaskCard;