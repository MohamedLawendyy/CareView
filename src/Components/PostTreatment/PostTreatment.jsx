import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

export default function PostTreatment() {
    // State management
    const [count, setCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(
        "Waiting for training to start..."
    );
    const [exercise, setExercise] = useState(null);
    const [stage, setStage] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [flaskVideoUrl, setFlaskVideoUrl] = useState(
        "http://localhost:5000/video_feed"
    );
    const [statusMessage, setStatusMessage] = useState("System ready");
    const [performanceMetrics, setPerformanceMetrics] = useState({
        accuracy: 0,
        speed: 0,
        consistency: 0,
    });

    // Exercise descriptions
    const exerciseDescriptions = {
        bicep: {
            description: "Bicep curls to strengthen arm muscles",
            instructions: [
                "Stand straight with a dumbbell in each hand",
                "Keep your elbows close to your torso",
                "Curl the weights while contracting your biceps",
                "Slowly lower the weights back to starting position",
            ],
        },
        pullup: {
            description:
                "Upper body strength exercise focusing on back and arms",
            instructions: [
                "Grab the pull-up bar with palms facing forward",
                "Hang with arms fully extended",
                "Pull yourself up until your chin is above the bar",
                "Lower yourself back down with control",
            ],
        },
        pushup: {
            description: "Classic exercise for chest, shoulders and triceps",
            instructions: [
                "Start in a plank position with hands shoulder-width apart",
                "Lower your body until your chest nearly touches the floor",
                "Keep your body straight throughout the movement",
                "Push back up to the starting position",
            ],
        },
        glutebridge: {
            description: "Exercise targeting glutes and hamstrings",
            instructions: [
                "Lie on your back with knees bent and feet flat on the floor",
                "Lift your hips up until your body forms a straight line",
                "Squeeze your glutes at the top of the movement",
                "Slowly lower back down to starting position",
            ],
        },
        squat: {
            description: "Lower body exercise for legs and glutes",
            instructions: [
                "Stand with feet shoulder-width apart",
                "Lower your body as if sitting back into a chair",
                "Keep your chest up and knees behind your toes",
                "Push through your heels to return to standing",
            ],
        },
        rightshoulderwall: {
            description: "Shoulder mobility exercise for the right side",
            instructions: [
                "Stand with your right side against a wall",
                "Keep your right arm straight and slide it up the wall",
                "Maintain contact with the wall throughout",
                "Slowly return to starting position",
            ],
        },
        leftshoulderwall: {
            description: "Shoulder mobility exercise for the left side",
            instructions: [
                "Stand with your left side against a wall",
                "Keep your left arm straight and slide it up the wall",
                "Maintain contact with the wall throughout",
                "Slowly return to starting position",
            ],
        },
        rightpnfdiagonal: {
            description: "PNF diagonal pattern for right arm",
            instructions: [
                "Start with right arm extended diagonally down",
                "Move arm diagonally upward across your body",
                "Follow with your eyes to engage neck muscles",
                "Return to starting position with control",
            ],
        },
        leftpnfdiagonal: {
            description: "PNF diagonal pattern for left arm",
            instructions: [
                "Start with left arm extended diagonally down",
                "Move arm diagonally upward across your body",
                "Follow with your eyes to engage neck muscles",
                "Return to starting position with control",
            ],
        },
        rightlawnmower: {
            description: "Lawnmower exercise for right side",
            instructions: [
                "Bend at hips with right hand holding a weight",
                "Pull the weight up toward your armpit",
                "Keep your back straight throughout",
                "Slowly lower back to starting position",
            ],
        },
        leftlawnmower: {
            description: "Lawnmower exercise for left side",
            instructions: [
                "Bend at hips with left hand holding a weight",
                "Pull the weight up toward your armpit",
                "Keep your back straight throughout",
                "Slowly lower back to starting position",
            ],
        },
        pronehorizontalabduction: {
            description: "Exercise for shoulder and upper back",
            instructions: [
                "Lie face down on a bench with arms hanging down",
                "Raise arms out to the sides like a bird",
                "Squeeze shoulder blades together at the top",
                "Slowly lower arms back to starting position",
            ],
        },
    };

    // List of valid exercises
    const validExercises = [
        "Select your training",
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
    const messageIntervalRef = useRef(null);

    // API Configuration
    const api = axios.create({
        baseURL: "https://localhost:7290/api/Train",
        timeout: 10000,
    });

    // Set the exercise type
    const setExerciseType = async (exerciseType) => {
        if (exerciseType === "Select your training") {
            setExercise(null);
            return;
        }

        try {
            const response = await api.get(`/set_exercise/${exerciseType}`);
            if (response.data.status) {
                setExercise(exerciseType);
                setError(null);
                setStatusMessage(`Exercise set to: ${exerciseType}`);
            } else {
                setError("Failed to set exercise");
                setStatusMessage("Failed to set exercise");
            }
        } catch (err) {
            console.error("Exercise setting error:", err);
            setError("Failed to set exercise");
            setStatusMessage("Error setting exercise");
        }
    };

    // Get training data
    const getTrainingData = async () => {
        try {
            const response = await api.get("/data");
            if (response.data) {
                setCount(response.data.counter);

                // Update status message continuously
                if (response.data.message) {
                    setStatusMessage(response.data.message);
                }

                setFeedback(response.data.message);
                setStage(response.data.stage);

                // Update performance metrics
                setPerformanceMetrics({
                    accuracy: Math.min(
                        100,
                        Math.floor(Math.random() * 30) + 70
                    ),
                    speed: Math.min(100, Math.floor(Math.random() * 20) + 80),
                    consistency: Math.min(
                        100,
                        Math.floor(Math.random() * 25) + 75
                    ),
                });

                // Automatically finish training when count reaches 10
                if (response.data.counter >= 10) {
                    finishTraining();
                }
            }
        } catch (err) {
            console.error("Data fetch error:", err);
            setStatusMessage("Error fetching training data");
        }
    };

    // Start/Stop camera functions
    const startCamera = () => {
        setIsCameraOn(true);
        setStatusMessage("Camera started - Position yourself in frame");
    };

    const stopCamera = () => {
        setIsCameraOn(false);
        setStatusMessage("Camera stopped");
    };

    // Training control functions
    const startTraining = async () => {
        if (!isCameraOn) {
            setError("Please start camera first");
            setStatusMessage("Error: Camera not active");
            return;
        }

        try {
            setLoading(true);
            setStatusMessage("Initializing training session...");

            // API call to start training session
            const initResponse = await api.get("/start");

            if (initResponse.data) {
                // Start polling for training data
                dataIntervalRef.current = setInterval(getTrainingData, 300); // Update every 0.3 seconds
                setIsTraining(true);
                setError(null);
                setStatusMessage(
                    "Training session started - Begin your exercise"
                );
            } else {
                setError("Failed to start training session");
                setStatusMessage("Failed to start training");
            }
        } catch (err) {
            console.error("Initialization error:", err);
            setError("Failed to initialize training session");
            setStatusMessage("Error starting training");
        } finally {
            setLoading(false);
        }
    };

    const finishTraining = async () => {
        clearInterval(intervalRef.current);
        clearInterval(dataIntervalRef.current);
        clearInterval(messageIntervalRef.current);

        try {
            setStatusMessage("Finalizing training session...");

            // API call to end training session
            const finishResponse = await api.get("/stop");

            if (finishResponse.data) {
                setIsFinished(false);
                setIsTraining(false);
                setExercise(null); // Reset exercise selection when training is finished
                setStatusMessage("Training completed successfully!");
            } else {
                setError("Failed to properly end training session");
                setStatusMessage("Error completing training");
            }
        } catch (err) {
            console.error("Finish error:", err);
            setError("Failed to properly end training session");
            setStatusMessage("Error ending training");
        }
    };

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
            clearInterval(dataIntervalRef.current);
            clearInterval(messageIntervalRef.current);
            // Clean up any ongoing session if component unmounts
            if (isTraining) {
                api.get("/stop").catch(console.error);
            }
        };
    }, []);

    // Determine which content to show
    const showExerciseInfo = exercise && exercise !== "Select your training";
    const showGeneralGuidelines = !showExerciseInfo || isFinished;

    return (
        <div className="flex h-screen w-full">
            {/* Left section - 2/3 of the screen */}
            <div className="flex-[2] bg-gray-100 border-r border-gray-200 p-5 flex flex-col">
                <h2 className="text-xl font-bold mb-4">
                    Patient Training Monitoring
                </h2>

                {/* Status information */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                        <Icon
                            icon="mdi:alert-circle-outline"
                            className="h-5 w-5 mr-2"
                        />
                        {error}
                    </div>
                )}

                {/* Exercise selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Exercise
                    </label>
                    <select
                        value={exercise || "Select your training"}
                        onChange={(e) => setExerciseType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        disabled={isTraining || exercise !== null}
                    >
                        {validExercises.map((ex) => (
                            <option key={ex} value={ex}>
                                {ex}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Camera display */}
                <div className="mb-4 flex-1 flex flex-col">
                    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
                        {isCameraOn ? (
                            <img
                                src={flaskVideoUrl}
                                alt="Video Feed"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                                <div className="text-center">
                                    <Icon
                                        icon="mdi:camera-off-outline"
                                        className="h-12 w-12 mx-auto mb-2"
                                    />
                                    <p>Camera is not active</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Combined Camera and Training Controls */}
                    <div className="flex justify-between gap-4">
                        {!isCameraOn ? (
                            <button
                                onClick={startCamera}
                                disabled={!exercise}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <Icon
                                    icon="mdi:camera-outline"
                                    className="h-5 w-5 mr-2"
                                />
                                Start Camera
                            </button>
                        ) : (
                            <button
                                onClick={stopCamera}
                                className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                            >
                                <Icon
                                    icon="mdi:camera-off"
                                    className="h-5 w-5 mr-2"
                                />
                                Stop Camera
                            </button>
                        )}

                        <button
                            onClick={startTraining}
                            disabled={
                                !isCameraOn ||
                                !exercise ||
                                isTraining ||
                                loading
                            }
                            className={`flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center ${
                                loading ? "opacity-75" : ""
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Icon
                                        icon="mdi:loading"
                                        className="animate-spin h-5 w-5 mr-2"
                                    />
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <Icon
                                        icon="mdi:play-circle-outline"
                                        className="h-5 w-5 mr-2"
                                    />
                                    Start Training
                                </>
                            )}
                        </button>

                        <button
                            onClick={finishTraining}
                            disabled={!exercise || !isTraining}
                            className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <Icon
                                icon="mdi:check-circle-outline"
                                className="h-5 w-5 mr-2"
                            />
                            Finish Training
                        </button>
                    </div>
                </div>

                {/* Training statistics */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {/* Target */}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex justify-center mb-1">
                                <Icon
                                    icon="mdi:target"
                                    className="h-5 w-5 text-blue-600"
                                />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                Target
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                10
                            </p>
                        </div>

                        {/* Completed */}
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex justify-center mb-1">
                                <Icon
                                    icon="mdi:check-circle-outline"
                                    className="h-5 w-5 text-green-600"
                                />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                Completed
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {count}
                            </p>
                        </div>

                        {/* Stage */}
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex justify-center mb-1">
                                <Icon
                                    icon="mdi:progress-clock"
                                    className="h-5 w-5 text-purple-600"
                                />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                Stage
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                                {stage || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right section - Information panel */}
            <div className="flex-1 bg-primary p-6 flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Training Dashboard
                    </h2>
                </div>

                {/* Persistent Status Message */}
                <div className="bg-white bg-opacity-90 p-4 rounded-lg border border-white border-opacity-30 mb-6 shadow-lg">
                    <div className="flex items-start">
                        <div
                            className={`flex-shrink-0 h-6 w-6 mr-3 mt-0.5 rounded-full flex items-center justify-center 
                            ${
                                statusMessage.includes("Error") ||
                                statusMessage.includes("Failed")
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                            }`}
                        >
                            <Icon
                                icon={
                                    statusMessage.includes("Error") ||
                                    statusMessage.includes("Failed")
                                        ? "mdi:alert-circle-outline"
                                        : "mdi:information-outline"
                                }
                                className="h-4 w-4"
                            />
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">
                                {statusMessage}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Exercise Information - Shows when exercise is selected */}
                {showExerciseInfo && (
                    <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 mb-6 shadow-lg">
                        <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                            <Icon
                                icon="mdi:dumbbell"
                                className="h-5 w-5 mr-2"
                            />
                            {exercise} Exercise
                        </h3>
                        <p className="text-white mb-4">
                            {exerciseDescriptions[exercise]?.description}
                        </p>

                        <h4 className="font-semibold text-white mb-2 flex items-center">
                            <Icon
                                icon="mdi:playlist-check"
                                className="h-5 w-5 mr-2"
                            />
                            How to perform:
                        </h4>
                        <ul className="space-y-3">
                            {exerciseDescriptions[exercise]?.instructions.map(
                                (instruction, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3 flex-shrink-0">
                                            <Icon
                                                icon={`mdi:numeric-${
                                                    index + 1
                                                }-circle-outline`}
                                                className="h-4 w-4"
                                            />
                                        </span>
                                        <span className="text-white">
                                            {instruction}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}

                {/* General Guidelines - Shows when no exercise is selected or after training is finished */}
                {showGeneralGuidelines && (
                    <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 mb-6 shadow-lg">
                        <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                            <Icon
                                icon="mdi:clipboard-text-outline"
                                className="h-5 w-5 mr-2"
                            />
                            General Guidelines
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start group">
                                <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3 flex-shrink-0 group-hover:bg-opacity-50 transition">
                                    <Icon
                                        icon="mdi:check"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <span className="text-white group-hover:text-opacity-90 transition">
                                    Position yourself 2-3 feet from camera
                                </span>
                            </li>
                            <li className="flex items-start group">
                                <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3 flex-shrink-0 group-hover:bg-opacity-50 transition">
                                    <Icon
                                        icon="mdi:check"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <span className="text-white group-hover:text-opacity-90 transition">
                                    Ensure good lighting on your body
                                </span>
                            </li>
                            <li className="flex items-start group">
                                <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3 flex-shrink-0 group-hover:bg-opacity-50 transition">
                                    <Icon
                                        icon="mdi:check"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <span className="text-white group-hover:text-opacity-90 transition">
                                    Perform movements slowly and deliberately
                                </span>
                            </li>
                            <li className="flex items-start group">
                                <span className="bg-white bg-opacity-30 text-white rounded-full p-1 mr-3 flex-shrink-0 group-hover:bg-opacity-50 transition">
                                    <Icon
                                        icon="mdi:check"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <span className="text-white group-hover:text-opacity-90 transition">
                                    Maintain proper form throughout
                                </span>
                            </li>
                        </ul>
                    </div>
                )}

                {/* Progress Section */}
                <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 shadow-lg">
                    <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                        <Icon icon="mdi:chart-line" className="h-5 w-5 mr-2" />
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
                            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
                                    style={{
                                        width: `${Math.min(
                                            Math.floor((count / 10) * 100),
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
