import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import CameraComponent from "../Camera/Camera.jsx"; // Import the camera component

export default function PostTreatment() {
    // State management
    const [count, setCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stream, setStream] = useState(null); // Add stream state
    const [feedback, setFeedback] = useState(null); // Add feedback state from API

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);

    // API Configuration
    const api = axios.create({
        baseURL: "http://localhost:5173/api", // Replace with your actual API endpoint
        timeout: 10000,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    // Handle when camera is started from the CameraComponent
    const handleCameraStarted = (stream) => {
        setStream(stream);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    };

    // Handle when camera is stopped from the CameraComponent
    const handleCameraStopped = () => {
        setStream(null);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Process and send frame data
    const sendFrameToBackend = async () => {
        if (!videoRef.current || !canvasRef.current || isFinished) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            canvas.toBlob(
                async (blob) => {
                    setLoading(true);
                    try {
                        const formData = new FormData();
                        formData.append("frame", blob, "frame.jpg");
                        
                        // API call to process the frame
                        const response = await api.post("/process-frame", formData);
                        
                        /*
                        // Expected API response structure:
                        // {
                        //   success: boolean,
                        //   correct: boolean,
                        //   feedback: string,
                        //   count: number
                        // }
                        */
                        
                        if (response.data.success) {
                            setFeedback(response.data.feedback || null);
                            if (response.data.correct) {
                                setCount(prev => response.data.count || prev + 1);
                            }
                        } else {
                            setError(response.data.error || "Failed to process frame");
                        }
                    } catch (err) {
                        console.error("API Error:", err);
                        setError("Failed to connect to the server. Please try again.");
                    } finally {
                        setLoading(false);
                    }
                },
                "image/jpeg",
                0.8
            );
        } catch (err) {
            console.error("Frame processing error:", err);
            setError("Error capturing video frame");
        }
    };

    // Training control functions
    const toggleTraining = async () => {
        if (isTraining) {
            clearInterval(intervalRef.current);
            setIsTraining(false);
        } else {
            if (!stream) {
                setError("Please start camera first");
                return;
            }
            
            try {
                // API call to initialize training session
                const initResponse = await api.post("/start-training");
                /*
                // Expected API response structure:
                // {
                //   success: boolean,
                //   session_id: string,
                //   message: string
                // }
                */
                
                if (!initResponse.data.success) {
                    setError(initResponse.data.message || "Failed to start training session");
                    return;
                }
                
                // Start sending frames to API
                intervalRef.current = setInterval(sendFrameToBackend, 500); // Send frame every 500ms
                setIsTraining(true);
                setError(null);
            } catch (err) {
                console.error("Initialization error:", err);
                setError("Failed to initialize training session");
            }
        }
    };

    const finishTraining = async () => {
        clearInterval(intervalRef.current);
        
        try {
            // API call to end training session
            const finishResponse = await api.post("/end-training");
            /*
            // Expected API response structure:
            // {
            //   success: boolean,
            //   total_count: number,
            //   message: string
            // }
            */
            
            if (finishResponse.data.success) {
                setCount(finishResponse.data.total_count || count);
                setIsFinished(true);
                setIsTraining(false);
                setFeedback("Training completed successfully!");
            } else {
                setError(finishResponse.data.message || "Failed to properly end training session");
            }
        } catch (err) {
            console.error("Finish error:", err);
            setError("Failed to properly end training session");
        }
    };

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
            // Clean up any ongoing session if component unmounts
            if (isTraining) {
                api.post("/end-training").catch(console.error);
            }
        };
    }, []);

    return (
        <div className="flex h-screen w-full">
            {/* Left section - 2/3 of the screen */}
            <div className="flex-[2] bg-gray-100 border-r border-gray-200 p-5 flex flex-col">
                <h2 className="text-xl font-bold mb-4">
                    Patient Training Monitoring
                </h2>

                {/* Status information */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {/* Feedback from API */}
                {feedback && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                        {feedback}
                    </div>
                )}

                {/* Camera component */}
                <div className="mb-4">
                    <CameraComponent
                        onCameraStart={handleCameraStarted}
                        onCameraStop={handleCameraStopped}
                        showDeviceSelection={true}
                    />
                </div>

                {/* Hidden video and canvas elements for frame processing */}
                <div className="hidden">
                    <video ref={videoRef} autoPlay playsInline muted />
                    <canvas ref={canvasRef} />
                </div>

                {/* Control buttons */}
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={toggleTraining}
                        disabled={!stream || isFinished || loading}
                        className={`px-4 py-2 rounded ${
                            isTraining ? "bg-red-500" : "bg-green-500"
                        } text-white disabled:bg-gray-400`}
                    >
                        {loading
                            ? "Processing..."
                            : isTraining
                            ? "Stop Training"
                            : "Start Training"}
                    </button>
                    <button
                        onClick={finishTraining}
                        disabled={isFinished}
                        className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-400"
                    >
                        Finish Training
                    </button>
                </div>

                {/* Training statistics */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Correct Repetitions
                            </p>
                            <p className="text-2xl font-bold">{count}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="text-2xl font-bold">
                                {isFinished
                                    ? "Finished"
                                    : isTraining
                                    ? "Training"
                                    : "Ready"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right section - Information panel */}
            <div className="flex-1 bg-primary p-6 flex flex-col">
                {/* Header with improved contrast */}
                <div className="flex items-center mb-6">
                    <div className="bg-white bg-opacity-30 p-2 rounded-full mr-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        Training Dashboard
                    </h2>
                </div>

                {/* Stats Cards with higher contrast */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white bg-opacity-20 p-4 rounded-lg border border-white border-opacity-30">
                        <p className="text-sm text-white text-opacity-90 mb-1">
                            Current Status
                        </p>
                        <p className="text-xl font-semibold text-white">
                            {isFinished ? (
                                <span className="flex items-center">
                                    <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                                    Completed
                                </span>
                            ) : isTraining ? (
                                <span className="flex items-center">
                                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                                    In Progress
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                                    Ready
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="bg-white bg-opacity-20 p-4 rounded-lg border border-white border-opacity-30">
                        <p className="text-sm text-white text-opacity-90 mb-1">
                            Correct Reps
                        </p>
                        <p className="text-xl font-semibold text-white">
                            {count}
                        </p>
                    </div>
                </div>

                {/* Instructions Card with better contrast */}
                <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 mb-6">
                    <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Exercise Guidelines
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </span>
                            <span className="text-white">
                                Position yourself 2-3 feet from camera
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </span>
                            <span className="text-white">
                                Ensure good lighting on your body
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </span>
                            <span className="text-white">
                                Perform movements slowly and deliberately
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </span>
                            <span className="text-white">
                                Maintain proper form throughout
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Progress Section with enhanced contrast */}
                <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 mb-6">
                    <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        Session Progress
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-white mb-1">
                                <span>Completion</span>
                                <span>
                                    {Math.min(
                                        Math.floor((count / 10) * 100),
                                        100
                                    )}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5">
                                <div
                                    className="bg-green-400 h-2.5 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            Math.floor((count / 10) * 100),
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-white bg-opacity-10 p-2 rounded">
                                <p className="text-xs text-white text-opacity-90">
                                    Target
                                </p>
                                <p className="font-medium text-white">10</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-2 rounded">
                                <p className="text-xs text-white text-opacity-90">
                                    Completed
                                </p>
                                <p className="font-medium text-white">
                                    {count}
                                </p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-2 rounded">
                                <p className="text-xs text-white text-opacity-90">
                                    Remaining
                                </p>
                                <p className="font-medium text-white">
                                    {Math.max(10 - count, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status with better contrast */}
                <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 mt-auto">
                    <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                        System Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-white">Camera</span>
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    stream
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white"
                                }`}
                            >
                                {stream ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white">AI Model</span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                                Connected
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white">Frame Rate</span>
                            <span className="font-medium text-white">
                                2 fps
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white">Last Update</span>
                            <span className="font-medium text-white">
                                {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}