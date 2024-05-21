"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import useAppContext from "@/context/AppContext";
import { useDisclosure } from "@mantine/hooks";
import {
    Group,
    Stack,
  Modal,
  Button,
  Image,
  Paper,
  Text,
  Title,
  Combobox,
  Input,
  InputBase,
  Loader,
  useCombobox,
} from "@mantine/core";
import AddTaskForm from "../../manage-tasks/AddTaskForm";
import TaskCard from "@/components/TaskCard";
import TaskList from "../../manage-tasks/TaskList";
import WorkSessionTable from "@/components/WorkSessionTable";

const ViewEmployee = () => {
  const [employee, setEmployee] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tasks, setTasks] = useState([]);
const [workSessions, setWorkSessions] = useState([{}]);
  const { id } = useParams();

  const { axiosInstance } = useAppContext();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        axiosInstance.get("/task/getall").then((response) => {
          setData(response.data);
          setLoading(false);
          combobox.resetSelectedOption();
        });
      }
    },
  });
  
  useEffect(() => {
    const fetchAssignments = async () => {
      const response = await axiosInstance.get(`/assignment/getbyemployee/${id}`);
      console.log(response.data);
      setTasks(response.data);
    };
  
    fetchAssignments();
  }, [id]);


  useEffect(() => {
    const fetchEmployeeSessions = async () => {
      const response = await axiosInstance.get(`/work-session/getbyemployee/${id}`);
      console.log(response.data);
      setWorkSessions(response.data);
    };

    fetchEmployeeSessions();
  }, [id]);



  const options = data.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item.taskName}
    </Combobox.Option>
  ));

  useEffect(() => {
    const fetchEmployee = async () => {
      const res = await axiosInstance.get(`/employee/getbyid/${id}`);
      console.log(res.data);
      setEmployee(res.data);
    };

    fetchEmployee();
  }, [id]);

  // const tasks = [
  //   {
  //     "_id": "662cd20774c6a6f9b401d9e6",
  //     "taskName": "hhgf",
  //     "description": "jgh",
  //     "assignedBy": "66238d20462640a5f78753df",
  //     "priority": "High",
  //     "status": "In Progress",
  //     "comments": [
  //       {
  //         "_id": "662cd20774c6a6f9b401d9e7"
  //       }
  //     ],
  //     "createdAt": "2024-04-27T10:23:03.993Z",
  //     "__v": 0
  //   },
  //   // ... rest of the tasks
  // ];
  return (
    <Paper p={50} shadow="xs">
        <Group justify="space-between">
       <Stack>
      <Image src={employee.avatar} radius="lg" w={150} h={150} />
      <Title order={4}> {employee.name}</Title>
      <Text size="sm"> Role : {employee.designation}</Text>
      <Text size="sm"> email : {employee.email}</Text>
      {/* Display other employee details here */}
      <Modal opened={opened} onClose={close} title="Add Task" size="auto">
        {/* <Button onClick={() => combobox.toggleDropdown()}>Assign Existing</Button> */}
        <Paper p={10} shadow="xs">
          <Text order={4} ta="center" c="gray">
            Assign Existing
          </Text>

          {/* <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
              setValue(val);
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={
                  loading ? <Loader size={18} /> : <Combobox.Chevron />
                }
                onClick={() => combobox.toggleDropdown()}
                rightSectionPointerEvents="none"
              >
                {value || <Input.Placeholder>Pick value</Input.Placeholder>}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {loading ? (
                  <Combobox.Empty>Loading....</Combobox.Empty>
                ) : (
                  options
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox> */}
          <Stack overflow="auto" maxHeight={200}>
                {loading ? (
                  <Text>Loading....</Text>
                ) : (
                 <TaskList employeeId={id}/>
                )}
              </Stack>
          {/* <Text order={6} ta="center" c="gray">-----------------OR---------------- </Text> */}
        </Paper>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #b4b9be" }}
          />
          <Text order={6} ta="center" c="gray" style={{ margin: "0 10px" }}>
            OR
          </Text>
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #b4b9be" }}
          />
        </div>
        <Paper p={10} shadow="xs">
          <Text order={4} ta="center" c="gray">
            Add New{" "}
          </Text>
          <AddTaskForm />
        </Paper>
      </Modal>

      <Button onClick={open}>Add Task</Button>
      </Stack>
      <Stack >
        <Paper p={10} shadow="xl" overflow='auto'>
        <Title order={4} ta="center" >Tasks </Title>
        <Group>
        {/* {tasks.map(task => <TaskCard key={task._id} task={task} />)} */}
        {tasks.map(({task, createdAt}) => <TaskCard key={task._id} task={task} />)}
        </Group>
        </Paper>
      </Stack>
      <Stack >
        <Paper p={10} shadow="xl" overflow='auto'>
          <Title order={4} ta="center" >Tasks </Title>
          <Group>
            {tasks.map(({task, createdAt}) => <TaskCard key={task._id} task={task} />)}
          </Group>
        </Paper>
        <WorkSessionTable workSessions={workSessions} /> {/* Add this line */}
      </Stack>

      </Group>
    </Paper>
  );
};

export default ViewEmployee;
