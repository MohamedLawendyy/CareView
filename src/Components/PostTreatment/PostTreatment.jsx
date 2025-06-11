import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function PostTreatment() {
    // State management
    const [count, setCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [exercise, setExercise] = useState("bicep");
    const [stage, setStage] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [flaskVideoUrl, setFlaskVideoUrl] = useState(
        "http://localhost:5000/video_feed"
    );

    // List of valid exercises
    const validExercises = [
        "bicep",
        "pullup",
        "pushup",
        "glutebridge",
        "squat",
        "rightshoulderwall",
        "leftshoulderwall",
        "rightpnfdiagonal",
        "leftpnfdiagonal",
        "rightlawnmower",
        "leftlawnmower",
        "pronehorizontalabduction",
    ];

    const videoRef = useRef(null);
    const intervalRef = useRef(null);
    const dataIntervalRef = useRef(null);

    // API Configuration
    const api = axios.create({
        baseURL: "https://localhost:7290/api/Train",
        timeout: 10000,
    });

    // Set the exercise type
    const setExerciseType = async (exerciseType) => {
        try {
            const response = await api.get(`/set_exercise/${exerciseType}`);
            if (response.data.status) {
                setExercise(exerciseType);
                setError(null);
            } else {
                setError("Failed to set exercise");
            }
        } catch (err) {
            console.error("Exercise setting error:", err);
            setError("Failed to set exercise");
        }
    };

    // Get training data
    const getTrainingData = async () => {
        try {
            const response = await api.get("/data");
            if (response.data) {
                setCount(response.data.counter);
                setFeedback(response.data.message);
                setStage(response.data.stage);
            }
        } catch (err) {
            console.error("Data fetch error:", err);
        }
    };

    // Start/Stop camera functions
    const startCamera = () => {
        setIsCameraOn(true);
    };

    const stopCamera = () => {
        setIsCameraOn(false);
    };

    // Training control functions
    const toggleTraining = async () => {
        if (isTraining) {
            clearInterval(intervalRef.current);
            clearInterval(dataIntervalRef.current);
            setIsTraining(false);
        } else {
            if (!isCameraOn) {
                setError("Please start camera first");
                return;
            }

            try {
                // API call to start training session
                const initResponse = await api.get("/start");

                if (initResponse.data) {
                    // Start polling for training data
                    dataIntervalRef.current = setInterval(getTrainingData, 400);
                    setIsTraining(true);
                    setError(null);
                } else {
                    setError("Failed to start training session");
                }
            } catch (err) {
                console.error("Initialization error:", err);
                setError("Failed to initialize training session");
            }
        }
    };

    const finishTraining = async () => {
        clearInterval(intervalRef.current);
        clearInterval(dataIntervalRef.current);

        try {
            // API call to end training session
            const finishResponse = await api.get("/stop");

            if (finishResponse.data) {
                setIsFinished(true);
                setIsTraining(false);
                setFeedback("Training completed successfully!");
            } else {
                setError("Failed to properly end training session");
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
            clearInterval(dataIntervalRef.current);
            // Clean up any ongoing session if component unmounts
            if (isTraining) {
                api.get("/stop").catch(console.error);
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

                {/* Exercise selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Exercise
                    </label>
                    <select
                        value={exercise}
                        onChange={(e) => setExerciseType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={isTraining}
                    >
                        {validExercises.map((ex) => (
                            <option key={ex} value={ex}>
                                {ex}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Camera display */}
                <div className="mb-4">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                        {isCameraOn ? (
                            <img
                                src={flaskVideoUrl}
                                alt="Video Feed"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                                Camera is not active
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mb-4">
                        {!isCameraOn ? (
                            <button
                                onClick={startCamera}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Start Camera
                            </button>
                        ) : (
                            <button
                                onClick={stopCamera}
                                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            >
                                Stop Camera
                            </button>
                        )}
                    </div>
                </div>

                {/* Control buttons */}
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={toggleTraining}
                        disabled={!isCameraOn || isFinished || loading}
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
                            <p className="text-sm text-gray-500">Stage</p>
                            <p className="text-2xl font-bold">
                                {stage || "Not started"}
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

                {/* Feedback from API - Moved to right section */}
                {feedback && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                        {feedback}
                    </div>
                )}

                {/* Video Feedback Section */}
                {isCameraOn && (
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
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            Exercise Feedback
                        </h3>
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                            {isCameraOn ? (
                                <img
                                    src={flaskVideoUrl}
                                    alt="Exercise Feedback"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    Feedback not available
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
            </div>
        </div>
    );
}
