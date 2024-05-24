"use client";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useRecordWebcam } from "react-record-webcam";

const { createContext, useEffect, useContext } = require("react");

const WorkSessionContext = createContext();

export const WorkSessionProvider = ({ children }) => {
  const [currentWorkSession, setCurrentWorkSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );

  const [videoDeviceId, setVideoDeviceId] = React.useState("");
  const [audioDeviceId, setAudioDeviceId] = React.useState("");

  const recordingRef = useRef(null);

  const [Recorder, setRecorder] = useState(null);
  const [displayMedia, setDisplayMedia] = useState(null);

  const [videoFileName, setVideoFileName] = useState("");

  const [workSessions, setWorkSessions] = useState([]);
const [videoRecording, setVideoRecording] = useState(null);
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

  const screenRecording = useRef(null);
  const createNewWorkession = () => {
    fetch("http://localhost:5000/work-session/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": currentUser.token,
      },
      body: JSON.stringify({
        employeeId: currentUser._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentWorkSession(data);
      });
  };
  const startScreenRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    const recorder = new MediaRecorder(stream);
    setRecorder(recorder);
    setDisplayMedia(stream.getVideoTracks()[0]);
    const screenRecordingChunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        screenRecordingChunks.push(e.data);
      }
    };
    recorder.onstop = () => {
      //onstop event of media recorder
      const blob = new Blob(screenRecordingChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      screenRecording.current.src = url;
      if (displayMedia) {
        displayMedia.stop();
      }
      saveRecording();
    };
    //Start the recording.
    recorder.start();
  };

  const startVideoRecording = async () => {
    console.log("start video recording");
    try {
      const recording = await createRecording();
      if (!recording) return;
      await openCamera(recording.id);
      await startRecording(recording.id);
      console.log("recording started", recording);
      setVideoRecording(recording);
      console.log('video id',recording.id)
      setTimeout(async() => {
        try {
          await stopRecording(recording.id);
          await closeCamera(recording.id);
        } catch (error) {
          console.log(error);
        }
        
      }, 3000);
      console.log("recording finished", recording);
    } catch (error) {
      console.log({ error });
    }
  };

  const start = async () => {
    const recording = await createRecording(videoDeviceId, audioDeviceId);
    if (recording) await openCamera(recording.id);
  };

  const stopVideoRecording = async () => {
    console.log("video recording in state",videoRecording);
    const recording = videoRecording;
    try {
      await stopRecording(recording.id);
      await closeCamera(recording.id);
      saveVideoRecording(recording.previewRef);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBlobMetadata = (blob, newType, newName) => {
    // Create a new Blob from the old Blob's data with the new type
    const newBlob = new Blob([blob], { type: newType });
    // Create a new File from the new Blob with the new name
    const newFile = new File([newBlob], newName, { type: newType });
    return newFile;
  };

  const generateRandomName = (type) => {
    const timestamp = Date.now();
    return `${type === 'screen' ? 'screen' :'video'}_recording_${timestamp}.webm`;
  };

  const uploadFile = (file) => {
    const fd = new FormData();
    fd.append("myfile", file);
    // fd.append("originalname", file.originalname); // Add originalname to the FormData
    fetch(`http://localhost:5000/util/uploadfile`, {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.status === 200) {
        console.log("file uploaded");
        notifications.show({ title: "Success", message: "video saved" });
        // setSelFile(file.name)
        // updatePodcast({ published: true, record: file.name });
      }
    });
  };

  const generateTitle = () => {
    return (
      "SCREEN_RECORDING_" +
      currentUser.name.replace(/ /g, "_") +
      new Date().toISOString().replace(/:/g, "_")
    );
  };

  const saveToDatabase = (filename) => {
    const data = {
      title: generateTitle(),
      employee: currentUser._id,
      file: filename,
    };
    fetch(`http://localhost:5000/recording/add`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log("file uploaded");
        toast.success("File Uploaded!!");
      }
    });
  };

  const saveVideoRecording = () => {
    fetch(screenRecording.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const file = updateBlobMetadata(
          blob,
          "video/webm",
          generateRandomName('video')
        );
        uploadFile(file);
        setVideoFileName(file.name);
        // saveToDatabase();
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // document.body.appendChild(a);
        // a.style = 'display: none';
        // a.href = url;
        // a.download = 'test.webm';
        // a.click();
        // window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error(error));
  };

  const saveRecording = () => {
    fetch(screenRecording.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const file = updateBlobMetadata(
          blob,
          "video/webm",
          generateRandomName('screen')
        );
        uploadFile(file);
        setVideoFileName(file.name);
        // saveToDatabase();
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // document.body.appendChild(a);
        // a.style = 'display: none';
        // a.href = url;
        // a.download = 'test.webm';
        // a.click();
        // window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error(error));
  };

  const stopScreenRecording = () => {
    if (Recorder) {
      Recorder.stop();
    }
  };

  const checkOut = () => {
    stopScreenRecording();
    stopVideoRecording();
    // console.log(videoFileName);
    fetch(
      `http://localhost:5000/work-session/update/${currentWorkSession._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser.token,
        },
        body: JSON.stringify({
          screenRecording: videoFileName,
          checkOutTime: new Date(),
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrentWorkSession(null);
      });
  };

  const fetchWorkSesions = async () => {
    const response = await axios.get(
      "http://localhost:5000/work-session/getbyemployee/" + currentUser._id,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser.token,
        },
      }
    );
    console.log("work session api ", response.data);
    setWorkSessions(response.data);
  };

  useEffect(() => {
    fetchWorkSesions();
  }, []);

  return (
    <WorkSessionContext.Provider
      value={{
        createNewWorkession,
        checkOut,
        startScreenRecording,
        stopScreenRecording,
        workSessions,
        setWorkSessions,
        fetchWorkSesions,
        startVideoRecording,
        stopVideoRecording,
      }}
    >
      {activeRecordings[0] && (
        <video ref={activeRecordings[0].previewRef} autoPlay loop playsInline style={{display:'none'}} />
      )}

      <video ref={screenRecording} height={300} width={600} controls  style={{display:'none'}} />
      {children}
    </WorkSessionContext.Provider>
  );
};

const useWorkSessionContext = () => useContext(WorkSessionContext);
export default useWorkSessionContext;
