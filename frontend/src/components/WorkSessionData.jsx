import React, { useState } from 'react'
import useWorkSessionContext from '@/context/WorkSessionContext';
import WorkSessionTable from './WorkSessionTable';

const WorkSessionData = () => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem("user"))
    );
    const { workSessions, setWorkSessions, fetchWorkSessions } = useWorkSessionContext();

    console.log("workSessions from workSessionContext",workSessions);

    return <WorkSessionTable workSessions={workSessions} />
}

export default WorkSessionData