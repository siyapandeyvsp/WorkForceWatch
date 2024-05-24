'use client';
import React from 'react';

import { Select } from './Select';
import { useRecordWebcam } from 'react-record-webcam';

export default function Record() {
  const {
    activeRecordings,
    cancelRecording,
    clearAllRecordings,
    clearError,
    clearPreview,
    closeCamera,
    createRecording,
    devicesById,
    devicesByType,
    download,
    errorMessage,
    muteRecording,
    openCamera,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
  } = useRecordWebcam();

  const [videoDeviceId, setVideoDeviceId] = React.useState('');
  const [audioDeviceId, setAudioDeviceId] = React.useState('');

  const handleSelect = async (event) => {
    const { deviceid: deviceId } =
      event.target.options[event.target.selectedIndex].dataset;
    if (devicesById?.[deviceId].type === 'videoinput') {
      setVideoDeviceId(deviceId);
    }
    if (devicesById?.[deviceId].type === 'audioinput') {
      setAudioDeviceId(deviceId);
    }
  };

  const quickDemo = async () => {
    try {
      const recording = await createRecording();
      if (!recording) return;
      await openCamera(recording.id);
      await startRecording(recording.id);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await stopRecording(recording.id);
      await closeCamera(recording.id);
      console.log(recording);
    } catch (error) {
      console.log({ error });
    }
  };

  const start = async () => {
    const recording = await createRecording(videoDeviceId, audioDeviceId);
    if (recording) await openCamera(recording.id);
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold">React Record Webcam demo</h1>
      <div className="space-y-2 my-4">
        <div className="flex">
          <h4>Select video input</h4>
          <Select
            items={devicesByType?.video || []}
            dataset="deviceid"
            onChange={handleSelect}
          />
        </div>
        <div className="flex">
          <h4>Select audio input</h4>
          <Select
            items={devicesByType?.audio || []}
            dataset="deviceid"
            onChange={handleSelect}
          />
        </div>
      </div>
      <div className="space-x-2">
        <button onClick={quickDemo}>Record 3s video</button>
        <button onClick={start}>Open camera</button>
        <button onClick={() => clearAllRecordings()}>Clear all</button>
        <button onClick={() => clearError()}>Clear error</button>
      </div>
      <div className="my-2">
        <p>{errorMessage ? `Error: ${errorMessage}` : ''}</p>
      </div>
      <div className="grid grid-cols-custom gap-4 my-4">
        {activeRecordings?.map((recording) => (
          <div className="bg-white rounded-lg px-4 py-4" key={recording.id}>
            <div className="text-black grid grid-cols-1">
              <p>Live</p>
              <small>Status: {recording.status}</small>
              <small>Video: {recording.videoLabel}</small>
              <small>Audio: {recording.audioLabel}</small>
            </div>
            <video ref={recording.webcamRef} loop autoPlay playsInline />
            <div className="space-x-1 space-y-1 my-2">
              <button
                inverted
                disabled={
                  recording.status === 'RECORDING' ||
                  recording.status === 'PAUSED'
                }
                onClick={() => startRecording(recording.id)}
              >
                Record
              </button>
              <button
                inverted
                disabled={
                  recording.status !== 'RECORDING' &&
                  recording.status !== 'PAUSED'
                }
                toggled={recording.status === 'PAUSED'}
                onClick={() =>
                  recording.status === 'PAUSED'
                    ? resumeRecording(recording.id)
                    : pauseRecording(recording.id)
                }
              >
                {recording.status === 'PAUSED' ? 'Resume' : 'Pause'}
              </button>
              <button
                inverted
                toggled={recording.isMuted}
                onClick={() => muteRecording(recording.id)}
              >
                Mute
              </button>
              <button inverted onClick={() => stopRecording(recording.id)}>
                Stop
              </button>
              <button inverted onClick={() => cancelRecording(recording.id)}>
                Cancel
              </button>
            </div>

            <div
              className={`${
                recording.previewRef.current?.src.startsWith('blob:')
                  ? 'visible'
                  : 'hidden'
              }`}
            >
              <p>Preview</p>
              <video ref={recording.previewRef} autoPlay loop playsInline />
              <div className="space-x-2 my-2">
                <button inverted onClick={() => download(recording.id)}>
                  Download
                </button>
                <button inverted onClick={() => clearPreview(recording.id)}>
                  Clear preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
