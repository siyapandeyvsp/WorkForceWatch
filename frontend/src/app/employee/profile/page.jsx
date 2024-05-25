 "use client";
// import React, { useState } from 'react';
// import { Paper, TextInput, Avatar, Button, Container, Tabs } from '@mantine/core';

// const EmployeeProfile = () => {
//   const [employee, setEmployee] = useState(JSON.parse(sessionStorage.getItem('employee')));  console.log("currentEmployee is ",sessionStorage.getItem('employee'));
 
 
//   const handleInputChange = (event) => {
//     setEmployee({
//       ...employee,
//       [event.target.name]: event.target.value
//     });
//   };

//   return (
//    <Container  p='sm'>
//     <Tabs defaultValue='General'>
//      <Tabs.List>
//       <Tabs.Tab value="General">General</Tabs.Tab>
//       <Tabs.Tab value="Contact">Contact</Tabs.Tab>
//       <Tabs.Tab value="Qualification">Qualification</Tabs.Tab>
//       <Tabs.Tab value="Bank">Bank</Tabs.Tab>
//       <Tabs.Tab value="Payroll">Payroll</Tabs.Tab>

//      </Tabs.List>
//       <Tabs.Panel value="General">
//       <Paper p="sm" shadow="xs" w={500}>
//         <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//           <Avatar src={employee.avatar} w={200} h={200}  />
//         </div>
//         <TextInput
//           label="Name"
//           placeholder="Enter name"
//           value={employee.name}
//           name="name"
//           onChange={handleInputChange}
//         />
//         <TextInput
//           label="Designation"
//           placeholder="Enter designation"
//           value={employee.designation}
//           name="designation"
//           onChange={handleInputChange}
//         />
//         <TextInput
//           label="Email"
//           placeholder="Enter email"
//           value={employee.email}
//           name="email"
//           onChange={handleInputChange}
//         />
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <Button color="blue" variant="outline">Update Profile</Button>
//         </div>
//       </Paper>
//       </Tabs.Panel>
//       <Tabs.Panel value="Contact">
//       <Paper p="sm" shadow="xs" w={500}>
//         <TextInput
//           label="Phone"
//           placeholder="Enter phone"
//           value={employee.phone}
//           name="phone"
//           onChange={handleInputChange}
//         />
//         <TextInput
//           label="Address"
//           placeholder="Enter address"
//           value={employee.address}
//           name="address"
//           onChange={handleInputChange}
//         />
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <Button color="blue" variant="outline">Update Contact</Button>
//         </div>
//       </Paper>
//       </Tabs.Panel>
//       <Tabs.Panel value="Qualification">
//       <Paper p="sm" shadow="xs" w={500}>
//         <TextInput
//           label="Degree"
//           placeholder="Enter degree"
//           value={employee.degree}
//           name="degree"
//           onChange={handleInputChange}
//         />
//         <TextInput
//           label="Institution"
//           placeholder="Enter institution"
//           value={employee.institution}
//           name="institution"
//           onChange={handleInputChange}
//         />
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <Button color="blue" variant="outline">Update Qualification</Button>
//         </div>
//       </Paper>
//       </Tabs.Panel>
//       <Tabs.Panel value="Bank">
//       <Paper p="sm" shadow="xs" w={500}>
//         <TextInput
//           label="Account Number"
//           placeholder="Enter account number"
//           value={employee.accountNumber}
//           name="accountNumber"
//           onChange={handleInputChange}
//         />
//         <TextInput
//           label="Bank Name"
//           placeholder="Enter bank name"
//           value={employee.bankName}
//           name="bankName"
//           onChange={handleInputChange}
//         />
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <Button color="blue" variant="outline">Update Bank</Button>
//         </div>
//       </Paper>
//       </Tabs.Panel>
//       <Tabs.Panel value="Payroll">
//       <Paper p="sm" shadow="xs" w={500}>
//         <TextInput
//           label="Salary"
//           placeholder="Enter salary"
//           value={employee.salary}
//           name="salary"
//           onChange={handleInputChange}
//         />
//         <TextInput
//           label="Tax"
//           placeholder="Enter tax"
//           value={employee.tax}
//           name="tax"
//           onChange={handleInputChange}
//         />
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <Button color="blue" variant="outline">Update Payroll</Button>
//         </div>
//       </Paper>
//       </Tabs.Panel>

     
//      </Tabs>
//       </Container>
//   );
// };

// export default EmployeeProfile;
import React, { useEffect, useState } from 'react';
import { Paper, Stack ,Image , TextInput, Avatar, Button, Container, Tabs, Group, Grid, Notification, Text } from '@mantine/core';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';
import useAppContext from "@/context/AppContext";

const EmployeeProfile = () => {
  const [basicEmployee,setBasicEmployee]=useState(JSON.parse(sessionStorage.getItem('employee')))
  const [employee, setEmployee] = useState(basicEmployee);
  const [isEditing, setIsEditing] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const { axiosInstance } = useAppContext();

  console.log("employee",employee)
  const handleInputChange = (event) => {
    setEmployee({
      ...employee,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave=()=>{
    setBasicEmployee(employee)
  }
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const response = await axiosInstance.get(`/employee/getbyid/${employee._id}`);
      setEmployee({ ...employee, ...response.data });
    };
  
    fetchEmployeeData();
  }, [basicEmployee]);

  const handleEdit = (section) => {
    setIsEditing({ ...isEditing, [section]: !isEditing[section] });
  };

  const handleUpdateProfile = async (section) => {
    axiosInstance.put(
      `/employee/update/${employee._id}`,
      employee,
      {
        headers: {
          "Content-Type": "application/json",
         
        },
      }
    )
    .then((response) => {
      setEmployee(response.data);
      setNotification({ message: 'Save Successful', type: 'success', visible: true });
      sessionStorage.setItem('employee', JSON.stringify(response.data));
      setIsEditing({ ...isEditing, [section]: false });
    })
    .catch((error) => {
      console.error('Error updating profile', error);
      setNotification({ message: 'Failed to save details', type: 'error', visible: true });
    });
  };

  return (
    <Container p="sm">
      {notification.visible && (
        <Notification
          color={notification.type === 'success' ? 'green' : 'red'}
          onClose={() => setNotification({ ...notification, visible: false })}
          icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
        >
          {notification.message}
        </Notification>
      )}
<Paper withBorder shadow='xl' radius={5} p={15}>
  <Group>
    <Image src={employee.avatar} alt="Employee Avatar" w={150}   radius={50}/>
    <Stack >
    <Text size='xl' >{employee.name}</Text>
    <Text>{employee.designation}</Text>
    <Text>{employee.email}</Text>
    </Stack>
  </Group>
</Paper>


      <Tabs defaultValue="General" mt={50}>
        <Tabs.List>
          <Tabs.Tab value="General">General</Tabs.Tab>
          <Tabs.Tab value="Contact">Contact</Tabs.Tab>
          <Tabs.Tab value="Qualification">Qualification</Tabs.Tab>
          <Tabs.Tab value="Bank">Bank</Tabs.Tab>
          <Tabs.Tab value="Payroll">Payroll</Tabs.Tab>
        </Tabs.List>

        {/* General Tab */}
        <Tabs.Panel value="General">
          <Paper p="sm" shadow="xs">
            <Group position="apart">
              <Text>General Information</Text>
              <IconEdit size={20} onClick={() => handleEdit('General')} style={{ cursor: 'pointer' }} />
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label=" Name"
                  placeholder="Enter name"
                  value={employee.name}
                  name="name"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              
              <Grid.Col span={6}>
                <TextInput
                  label="Father's Name"
                  placeholder="Enter father's name"
                  value={employee.fathersName}
                  name="fathersName"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Mother's Name"
                  placeholder="Enter mother's name"
                  value={employee.mothersName}
                  name="mothersName"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="DOB"
                  placeholder="Enter date of birth"
                  value={employee.dob}
                  name="dob"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Age"
                  placeholder="Enter age"
                  value={employee.age}
                  name="age"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Blood Group"
                  placeholder="Enter blood group"
                  value={employee.bloodGroup}
                  name="bloodGroup"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Marital Status"
                  placeholder="Enter marital status"
                  value={employee.maritalStatus}
                  name="maritalStatus"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Gender"
                  placeholder="Enter gender"
                  value={employee.gender}
                  name="gender"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Employee ID"
                  placeholder="Enter employee ID"
                  value={employee._id}
                  name="employeeId"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Category"
                  placeholder="Enter category"
                  value={employee.category}
                  name="category"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Employment Type"
                  placeholder="Enter employment type"
                  value={employee.employmentType}
                  name="employmentType"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Religion"
                  placeholder="Enter religion"
                  value={employee.religion}
                  name="religion"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Date of Joining"
                  placeholder="Enter date of joining"
                  value={employee.dateOfJoining}
                  name="dateOfJoining"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Probation (months)"
                  placeholder="Enter probation period"
                  value={employee.probationMonths}
                  name="probationMonths"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Date of Confirmation"
                  placeholder="Enter date of confirmation"
                  value={employee.dateOfConfirmation}
                  name="dateOfConfirmation"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Official Email"
                  placeholder="Enter official email"
                  value={employee.officialEmail}
                  name="officialEmail"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Written Language"
                  placeholder="Enter written language"
                  value={employee.writtenLanguage}
                  name="writtenLanguage"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Spoken Language"
                  placeholder="Enter spoken language"
                  value={employee.spokenLanguage}
                  name="spokenLanguage"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Mother Tongue"
                  placeholder="Enter mother tongue"
                  value={employee.motherTongue}
                  name="motherTongue"
                  onChange={handleInputChange}
                  disabled={!isEditing.General}
                />
              </Grid.Col>
            </Grid>
            {isEditing.General && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button color="blue" variant="outline" onClick={() => handleUpdateProfile('General')}>
                  Save
                </Button>
              </div>
            )}
          </Paper>
        </Tabs.Panel>

        {/* Contact Tab */}
        <Tabs.Panel value="Contact">
          <Paper p="sm" shadow="xs">
            <Group position="apart">
              <Text>Contact Information</Text>
              <IconEdit size={20} onClick={() => handleEdit('Contact')} style={{ cursor: 'pointer' }} />
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="House Number"
                  placeholder="Enter house number"
                  value={employee.houseNumber}
                  name="houseNumber"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Area/Street/Village"
                  placeholder="Enter area/street/village"
                  value={employee.area}
                  name="area"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Town/City"
                  placeholder="Enter town/city"
                  value={employee.townCity}
                  name="townCity"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="District"
                  placeholder="Enter district"
                  value={employee.district}
                  name="district"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Country"
                  placeholder="Enter country"
                  value={employee.country}
                  name="country"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="State"
                  placeholder="Enter state"
                  value={employee.state}
                  name="state"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Pincode"
                  placeholder="Enter pincode"
                  value={employee.pincode}
                  name="pincode"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Contact Number"
                  placeholder="Enter contact number"
                  value={employee.contactNumber}
                  name="contactNumber"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Emergency Number"
                  placeholder="Enter emergency number"
                  value={employee.emergencyNumber}
                  name="emergencyNumber"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Personal Email"
                  placeholder="Enter personal email"
                  value={employee.personalEmail}
                  name="personalEmail"
                  onChange={handleInputChange}
                  disabled={!isEditing.Contact}
                />
              </Grid.Col>
            </Grid>
            {isEditing.Contact && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button color="blue" variant="outline" onClick={() => handleUpdateProfile('Contact')}>
                  Save
                </Button>
              </div>
            )}
          </Paper>
        </Tabs.Panel>

        {/* Qualification Tab */}
        <Tabs.Panel value="Qualification">
          <Paper p="sm" shadow="xs">
            <Group position="apart">
              <Text>Qualification Details</Text>
              <IconEdit size={20} onClick={() => handleEdit('Qualification')} style={{ cursor: 'pointer' }} />
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="High School Percentage"
                  placeholder="Enter high school percentage"
                  value={employee.highSchoolPercentage}
                  name="highSchoolPercentage"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="High School Name"
                  placeholder="Enter high school name"
                  value={employee.highSchoolName}
                  name="highSchoolName"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="High School Board"
                  placeholder="Enter high school board"
                  value={employee.highSchoolBoard}
                  name="highSchoolBoard"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Intermediate Percentage"
                  placeholder="Enter intermediate percentage"
                  value={employee.intermediatePercentage}
                  name="intermediatePercentage"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Intermediate School"
                  placeholder="Enter intermediate school"
                  value={employee.intermediateSchool}
                  name="intermediateSchool"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Intermediate Board"
                  placeholder="Enter intermediate board"
                  value={employee.intermediateBoard}
                  name="intermediateBoard"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Graduation Degree"
                  placeholder="Enter graduation degree"
                  value={employee.graduationDegree}
                  name="graduationDegree"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Graduation Percentage/CGPA"
                  placeholder="Enter graduation percentage/CGPA"
                  value={employee.graduationPercentage}
                  name="graduationPercentage"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Post Graduation Degree"
                  placeholder="Enter post graduation degree"
                  value={employee.postGraduationDegree}
                  name="postGraduationDegree"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Post Graduation Percentage/CGPA"
                  placeholder="Enter post graduation percentage/CGPA"
                  value={employee.postGraduationPercentage}
                  name="postGraduationPercentage"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Additional Certifications"
                  placeholder="Enter additional certifications"
                  value={employee.additionalCertifications}
                  name="additionalCertifications"
                  onChange={handleInputChange}
                  disabled={!isEditing.Qualification}
                />
              </Grid.Col>
            </Grid>
            {isEditing.Qualification && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button color="blue" variant="outline" onClick={() => handleUpdateProfile('Qualification')}>
                  Save
                </Button>
              </div>
            )}
          </Paper>
        </Tabs.Panel>

        {/* Bank Tab */}
        <Tabs.Panel value="Bank">
          <Paper p="sm" shadow="xs">
            <Group position="apart">
              <Text>Bank Details</Text>
              <IconEdit size={20} onClick={() => handleEdit('Bank')} style={{ cursor: 'pointer' }} />
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Account Number"
                  placeholder="Enter account number"
                  value={employee.accountNumber}
                  name="accountNumber"
                  onChange={handleInputChange}
                  disabled={!isEditing.Bank}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Bank Name"
                  placeholder="Enter bank name"
                  value={employee.bankName}
                  name="bankName"
                  onChange={handleInputChange}
                  disabled={!isEditing.Bank}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Bank Branch"
                  placeholder="Enter bank branch"
                  value={employee.bankBranch}
                  name="bankBranch"
                  onChange={handleInputChange}
                  disabled={!isEditing.Bank}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="IFSC Code"
                  placeholder="Enter IFSC code"
                  value={employee.ifscCode}
                  name="ifscCode"
                  onChange={handleInputChange}
                  disabled={!isEditing.Bank}
                />
              </Grid.Col>
            </Grid>
            {isEditing.Bank && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button color="blue" variant="outline" onClick={() => handleUpdateProfile('Bank')}>
                  Save
                </Button>
              </div>
            )}
          </Paper>
        </Tabs.Panel>

        {/* Payroll Tab */}
        <Tabs.Panel value="Payroll">
          <Paper p="sm" shadow="xs">
            <Group position="apart">
              <Text>Payroll Details</Text>
              <IconEdit size={20} onClick={() => handleEdit('Payroll')} style={{ cursor: 'pointer' }} />
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Gross Salary"
                  placeholder="Enter gross salary"
                  value={employee.grossSalary}
                  name="grossSalary"
                  onChange={handleInputChange}
                  disabled={!isEditing.Payroll}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Basic Salary"
                  placeholder="Enter basic salary"
                  value={employee.basicSalary}
                  name="basicSalary"
                  onChange={handleInputChange}
                  disabled={!isEditing.Payroll}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="HRA"
                  placeholder="Enter HRA"
                  value={employee.hra}
                  name="hra"
                  onChange={handleInputChange}
                  disabled={!isEditing.Payroll}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="DA"
                  placeholder="Enter DA"
                  value={employee.da}
                  name="da"
                  onChange={handleInputChange}
                  disabled={!isEditing.Payroll}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Tax Deductions"
                  placeholder="Enter tax deductions"
                  value={employee.taxDeductions}
                  name="taxDeductions"
                  onChange={handleInputChange}
                  disabled={!isEditing.Payroll}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Employee EPF"
                  placeholder="Enter employee EPF"
                  value={employee.employeeEpf}
                  name="employeeEpf"
                  onChange={handleInputChange}
                  disabled={!isEditing.Payroll}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Employee ESIC"
                  placeholder="Enter employee ESIC"
                  value={employee.employeeEsic}
                  name="employeeEsic"
                  onChange={handleInputChange}
                  disabled={!isEditing.Payroll}
                />
              </Grid.Col>
            </Grid>
            {isEditing.Payroll && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button color="blue" variant="outline" onClick={() => handleUpdateProfile('Payroll')}>
                  Save
                </Button>
              </div>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>
      
    </Container>
  );
};

export default EmployeeProfile;
