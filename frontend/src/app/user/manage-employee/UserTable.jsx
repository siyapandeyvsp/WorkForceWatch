import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useState , useEffect} from 'react';


// const jobColors = {
//   engineer: 'blue',
//   manager: 'cyan',
//   designer: 'pink',
// };

export function UsersTable() {
    const [employeeList,setEmployeeList] = useState([]);
    const readEmployees = () => {
        fetch("http://localhost:5000/employee/getall")
          .then((res) => {
            console.log(res.status);
            return res.json();
          })
          .then((data) => {
            console.log(data);
            setEmployeeList(data);
          })
          .catch((err) => {
            console.log(err);
          });
      };
    
      useEffect(() => {
        readEmployees();
      }, []);
    
      const deleteEmployee = (id) => {
        fetch("http://localhost:5000/employee/delete/" + id, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.status === 200) {
              notifications.show({ title: "Success", message: "Employee deleted successfully" });
              readEmployees();
            } else {
              notifications.show({ title: "Error", message: "Failed to delete employee" });
            }
          })
          .catch((err) => {
            console.log(err);
           notifications.show({ title: "Error", message: "Failed to delete employee" });
          });
      }; 
 
 
 
 
    const rows = employeeList.map((employee) => (
    <Table.Tr key={employee.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={employee.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {employee.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        {/* <Badge color={jobColors[employee.job.toLowerCase()]} variant="light"> */}
        <Badge >
          {employee.designation}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {employee.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{employee.phone}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={()=>deleteEmployee(employee._id)} >
            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Job title</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}