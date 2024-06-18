import { Container, Stack, Title, Table, Button, Modal } from '@mantine/core'
import React, { useState } from 'react'

const WorkSessionTable = ({ workSessions }) => {
    const [modalOpened, setModalOpened] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');

    const openModal = (video) => {
        setCurrentVideo(video);
        setModalOpened(true);
    }

    const rows = workSessions.map((session, index) => (
        <Table.Tr key={index}>
            <Table.Td>{new Date(session.checkInTime).toLocaleString()}</Table.Td>
            <Table.Td>{new Date(session.checkOutTime).toLocaleString()}</Table.Td>
            <Table.Td>{new Date(session.createdAt).toLocaleString()}</Table.Td>
            <Table.Td>
                <Button onClick={() => openModal(session.screenRecording)}>View Recording</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <Container>
                <Stack>
                    <Title>Work Sessions</Title>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Check In Time</Table.Th>
                                <Table.Th>Check Out Time</Table.Th>
                                <Table.Th>Created At</Table.Th>
                                <Table.Th>Screen Recording</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
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
    )
}

export default WorkSessionTable