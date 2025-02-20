import { Container, Stack, Title, Table, Button, Modal, Text, Group, Paper, ScrollArea } from '@mantine/core';
import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const WorkSessionTable = ({ workSessions }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  const openModal = (video) => {
    setCurrentVideo(video);
    setModalOpened(true);
  };

  const calculateDuration = (checkInTime, checkOutTime) => {
    const checkInDate = new Date(checkInTime);
    const checkOutDate = new Date(checkOutTime);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return 'Invalid date';
    }

    const duration = checkOutDate - checkInDate;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const totalHours = useMemo(() => {
    return workSessions.reduce((total, session) => {
      const checkInDate = new Date(session.checkInTime);
      const checkOutDate = new Date(session.checkOutTime);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return total;
      }

      const duration = checkOutDate - checkInDate;
      return total + duration;
    }, 0);
  }, [workSessions]);

  const chartData = useMemo(() => {
    const labels = workSessions.map((session, index) => `Session ${index + 1}`);
    const data = workSessions.map(session => {
      const checkInDate = new Date(session.checkInTime);
      const checkOutDate = new Date(session.checkOutTime);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return 0;
      }

      const duration = checkOutDate - checkInDate;
      return duration / (1000 * 60 * 60); // Convert to hours
    });

    return {
      labels,
      datasets: [
        {
          label: 'Hours Worked',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [workSessions]);

  const rows = workSessions.map((session, index) => (
    <tr key={index}>
      <td>{new Date(session.checkInTime).toLocaleString()}</td>
      <td>{new Date(session.checkOutTime).toLocaleString()}</td>
      <td>{calculateDuration(session.checkInTime, session.checkOutTime)}</td>
      <td>{new Date(session.createdAt).toLocaleString()}</td>
      <td>
        <Button onClick={() => openModal(session.screenRecording)} variant="light" color="blue" size="xs">
          View Recording
        </Button>
      </td>
    </tr>
  ));

  return (
    <div>
      <Container>
        <Stack spacing="lg">
          <Title order={2} align="center">Work Sessions</Title>
          <Paper padding="md" shadow="sm" radius="md">
            <Group position="apart" mb="md">
              <Text>Total Hours Worked: {(totalHours / (1000 * 60 * 60)).toFixed(2)} hours</Text>
            </Group>
            <Bar data={chartData} />
          </Paper>
          <Paper padding="md" shadow="sm" radius="md">
            <ScrollArea>
              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Check In Time</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Check Out Time</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Duration</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Created At</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Screen Recording</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Stack>
      </Container>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Screen Recording"
        size="xl"
        styles={{ modal: { borderRadius: '10px' } }}
      >
        <video controls src={`${process.env.NEXT_PUBLIC_API_URL}/${currentVideo}`} style={{ width: '100%', height: 'auto' }}></video>
      </Modal>
    </div>
  );
};

export default WorkSessionTable;