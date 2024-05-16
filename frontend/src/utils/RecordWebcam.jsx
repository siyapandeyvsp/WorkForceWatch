"use client";
import { useRecordWebcam } from "react-record-webcam";

export const RecordWebcam = () => {
  const {
    createRecording,
    openCamera,
    startRecording,
    stopRecording,
    
  } = useRecordWebcam();

  const recordVideo = async () => {
    const recording = await createRecording();
    await openCamera(recording.id);
    await startRecording(recording.id);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Record for 3 seconds
    await stopRecording(recording.id);
    await downloadRecording(recording.id); // Download the recording
  };
//   // Upload the blob to a back-end
//   const formData = new FormData();
//   formData.append("file", recorded.blob, "recorded.webm");

//   const response = fetch("https://your-backend-url.com/upload", {
//     method: "POST",
//     body: formData,
//   });

  return (
    <div>
      <button onClick={recordVideo}>Record Video</button>;
      {/* {activeRecordings.map((recording) => (
        <div key={recording.id}>
          <video ref={recording.webcamRef} autoPlay />
          <video ref={recording.previewRef} autoPlay loop />
        </div>
      ))} */}
    </div>
  );
};

// import React, { useState } from 'react';
// import { useRecordWebcam } from 'react-record-webcam';

// const RecordWebcam = () => {
//   const [recording, setRecording] = useState(null);

//   const startRecording = async () => {
//     const newRecording = await useRecordWebcam();
//     setRecording(newRecording);
//   };

//   const stopRecording = async () => {
//     await recording.stop();
//     setRecording(null);
//   };

//   const downloadRecording = async () => {
//     const blob = await recording.getBlob();
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'recording.webm';
//     link.click();
//   };

//   return (
//     <div>
//       <button onClick={startRecording}>Start Recording</button>
//       <button onClick={stopRecording}>Stop Recording</button>
//       <button onClick={downloadRecording}>Download Recording</button>
//     </div>
//   );
// };

// export default RecordWebcam;
