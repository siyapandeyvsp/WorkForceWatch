import Record from '@/utils/Record'
import ScreenRecorder from '@/utils/ScreenRecorder'
import { Title } from '@mantine/core'
import React from 'react'

const RecordingSettings = () => {
  return (
    <div>
        <Title> Screen Recording Settings</Title>
        <ScreenRecorder/>
        <Title>Webcam Recorder Settings </Title>
        <Record/>
        </div>
  )
}

export default RecordingSettings