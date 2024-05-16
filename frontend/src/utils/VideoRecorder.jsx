'use client'
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
const ScreenRecorder = () => {

    const screenRecording = useRef(null);

    const [Recorder, setRecorder] = useState(null);
    const [displayMedia, setDisplayMedia] = useState(null);

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('employee')));

    const startScreenRecording = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: true, video: true
        });
        const recorder = new MediaRecorder(stream);
        setRecorder(recorder);
        setDisplayMedia(stream.getVideoTracks()[0]);
        const screenRecordingChunks = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                screenRecordingChunks.push(e.data);
            }
        }
        recorder.onstop = () => {
            //onstop event of media recorder  
            const blob = new Blob(screenRecordingChunks,
                { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            screenRecording.current.src = url;
            if (displayMedia) {
                displayMedia.stop();
            }
        }
        //Start the recording. 
        recorder.start();
    }

    const updateBlobMetadata = (blob, newType, newName) => {
        // Create a new Blob from the old Blob's data with the new type
        const newBlob = new Blob([blob], { type: newType });
        // Create a new File from the new Blob with the new name
        const newFile = new File([newBlob], newName, { type: newType });
        return newFile;
    };

    const generateRandomName = () => {
        const timestamp = Date.now();
        return `screen_recording_${timestamp}.webm`;
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
                toast.success('File Uploaded!!');
                // setSelFile(file.name)
                // updatePodcast({ published: true, record: file.name });
            }
        });
    };

    const generateTitle = () => {
        return 'SCREEN_RECORDING_' + currentUser.name.replace(/ /g, '_') + new Date().toISOString().replace(/:/g, '_');
    }

    const saveToDatabase = (filename) => {
        const data = {
            title: generateTitle(),
            employee: currentUser._id,
            file: filename,
            type: 'screen'
        }
        fetch(`http://localhost:5000/recording/add`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 200) {
                console.log("file uploaded");
                toast.success('File Uploaded!!');
            }
        });
    }

    const saveRecording = () => {
        fetch(screenRecording.current.src)
            .then(response => response.blob())
            .then(blob => {
                const file = updateBlobMetadata(blob, 'video/webm', generateRandomName());
                uploadFile(file);
                saveToDatabase(file.name);
                // const url = URL.createObjectURL(blob);
                // const a = document.createElement('a');
                // document.body.appendChild(a);
                // a.style = 'display: none';
                // a.href = url;
                // a.download = 'test.webm';
                // a.click();
                // window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error(error));
    }

    const displayEmployeeTasks = () => {
        return <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>

                    <th
                        scope="col"
                        className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                    >
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Task Name
                            </span>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Assigned On
                            </span>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Description
                            </span>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Status
                            </span>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                Deadline
                            </span>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-end" />
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {
                    taskList.map(task => (
                        <tr>
                            <td className="size-px whitespace-nowrap">
                                <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                                    <div className="flex items-center gap-x-3">

                                        <div className="grow">
                                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                                {task.name}
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="h-px w-72 whitespace-nowrap">
                                <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </span>

                                </div>
                            </td>
                            <td className="h-px w-72 whitespace-nowrap">
                                <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                        {task.description}
                                    </span>

                                </div>
                            </td>
                            <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3">
                                    <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                        <svg
                                            className="size-2.5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                        </svg>
                                        Active
                                    </span>
                                </div>
                            </td>
                            <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3">
                                    <span className="text-sm text-gray-500 dark:text-neutral-500">
                                        {new Date(task.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </td>
                            <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-1.5">
                                    <Link
                                        href={`/employee/update-task/${task._id}`}
                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"

                                    >
                                        Edit
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    }

    return (
        <>
            <div className="inline-flex rounded-lg shadow-sm">
                <button
                    onClick={() =>
                        startScreenRecording()}
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                >
                    Start Recording
                </button>
                <button
                    onClick={() => { Recorder && Recorder.stop() }}
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                >
                    Stop Recording
                </button>
                <button
                    type="button"
                    onClick={saveRecording}
                    className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                >
                    Save Recording
                </button>
            </div>
            <video ref={screenRecording} height={300} width={600} controls />
        </>
    );
};
export default ScreenRecorder;