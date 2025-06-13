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

    // Valid exercises list
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

    // Invalid exercises list with YouTube references
    const invalidExercises = {
        "pendulum swings": {
            description:
                "Gravity-assisted shoulder mobility; reduces joint stiffness post-op",
            videoId:
                "https://www.youtube.com/embed/wD3jQJ-dGnY?si=_z-eEzCd-ayxRBzJ",
        },
        "external rotation with resistance band": {
            description:
                "Strengthens infraspinatus and teres minor; key for rotator cuff rehab",
            videoId:
                "https://www.youtube.com/embed/ybNV36DoRfY?si=7ozGoXmFTrYZy_ly",
        },
        "wall slides": {
            description:
                "Improves scapular rhythm and shoulder elevation range",
            videoId:
                "https://www.youtube.com/embed/WIdjSjzNS2A?si=52OngxKT_B5X5hKT",
        },
        "scapular retraction exercises": {
            description:
                "Trains rhomboids and middle trapezius for posture and stability",
            videoId:
                "https://www.youtube.com/embed/hJffqKmfnfA?si=I5-SNJ4RA3GuXF-_",
        },
        "wand-assisted shoulder flexion": {
            description:
                "Used for active-assisted range work to improve shoulder mobility",
            videoId:
                "https://www.youtube.com/embed/lalbbBdtSZ0?si=c9Or-Fe3pQiNivK7",
        },
        "serratus punches": {
            description: "Enhances scapular protraction and prevents winging",
            videoId:
                "https://www.youtube.com/embed/pD4fZIFlXAY?si=zUmph112k9xwPeHR",
        },
        "passive ROM exercises": {
            description:
                "Maintains joint capsule extensibility in stiff or painful shoulders",
            videoId:
                "https://www.youtube.com/embed/J-YE4lAVEmo?si=rY6jAo7QOOS6qB6_",
        },
        "cane-assisted ROM": {
            description:
                "Guided assistance for improving shoulder ROM post-injury",
            videoId:
                "https://www.youtube.com/embed/tozSAv28oeg?si=MgBZtpmeE7XcrLpX",
        },
        "towel stretches": {
            description:
                "Self-stretching using a towel to target internal rotation deficits",
            videoId:
                "https://www.youtube.com/embed/omeww85Mhkw?si=qoyXEYJZrkNlGqIX",
        },
        "scapular stabilization": {
            description:
                "Isometric and dynamic control for shoulder blade coordination",
            videoId:
                "https://www.youtube.com/embed/WoP0-kLXsRo?si=GU3yugqY14hoFnFE",
        },
        "side-lying scapular protraction": {
            description:
                "Targets serratus anterior to improve scapular stability",
            videoId:
                "https://www.youtube.com/embed/pjC62I0FjC0?si=nrSZp7sf1X1W9uBc",
        },
        "isometric shoulder flexion and abduction": {
            description: "Builds strength without joint motion post-surgery",
            videoId:
                "https://www.youtube.com/embed/5pO505spQn8?si=PkgrvyHuYoVuhvZ2",
        },
        "scaption in external rotation": {
            description:
                "Safe ROM pattern that activates supraspinatus without impingement",
            videoId:
                "https://www.youtube.com/embed/4GX3SUbmOSs?si=1MrpY8dXJ-lkjqJC",
        },
        "Codman's (pendulum) exercises": {
            description:
                "Uses gravity to promote gentle shoulder motion and pain relief",
            videoId:
                "https://www.youtube.com/embed/QF_ubbr_RUE?si=QsJzz5lo6lBf60F5",
        },
        "cross-body adduction stretch": {
            description:
                "Increases posterior capsule flexibility, often limited in frozen shoulder",
            videoId:
                "https://www.youtube.com/embed/swvXpKN832E?si=LmeWHudIMIIr6aLU",
        },
        "table slides": {
            description: "Reduces friction to support active-assisted mobility",
            videoId:
                "https://www.youtube.com/embed/8bWUvRhU_mM?si=icvISoH95-je3Agr",
        },
        "supine passive shoulder elevation": {
            description:
                "Gravity-eliminated position to restore flexion early post-op",
            videoId:
                "https://www.youtube.com/embed/szppUBZJ4l0?si=5qITYhrsrZ3RFonM",
        },
        "closed-chain wall push-up plus": {
            description:
                "Dynamic scapular stability through protraction in functional position",
            videoId:
                "https://www.youtube.com/embed/J19XZHc07cc?si=xF_Y3WfguXKlzf5C",
        },
        "prone horizontal abduction": {
            description:
                "Recruits middle/lower trapezius and posterior deltoid for scapular control",
            videoId:
                "https://www.youtube.com/embed/_ipVLm6NZ-s?si=ylpyOm8UMVWjzH51",
        },
    };

    // Grouped exercises for dropdown with optgroup
    const groupedExercises = [
        {
            label: "Trackable Exercises",
            options: validExercises.filter(
                (ex) => ex !== "Select your training"
            ),
        },
        {
            label: "Reference Exercises",
            options: Object.keys(invalidExercises),
        },
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
            // For valid exercises, call the API
            if (validExercises.includes(exerciseType)) {
                const response = await api.get(`/set_exercise/${exerciseType}`);
                if (response.data.status) {
                    setExercise(exerciseType);
                    setError(null);
                    setStatusMessage(`Exercise set to: ${exerciseType}`);
                } else {
                    setError("Failed to set exercise");
                    setStatusMessage("Failed to set exercise");
                }
            } else {
                // For invalid exercises, just set the state
                setExercise(exerciseType);
                setError(null);
                setStatusMessage(
                    `Reference exercise selected: ${exerciseType}`
                );
            }
        } catch (err) {
            console.error("Exercise setting error:", err);
            setError("Failed to set exercise");
            setStatusMessage("Error setting exercise");
        }
    };

    // Check if current exercise is in invalidExercises
    const isInvalidExercise = exercise && invalidExercises[exercise];

    // Get training data
    const getTrainingData = async () => {
        try {
            const response = await api.get("/data");
            if (response.data) {
                setCount(response.data.counter);

                if (response.data.message) {
                    setStatusMessage(response.data.message);
                }

                setFeedback(response.data.message);
                setStage(response.data.stage);

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
        if (!isCameraOn && !isInvalidExercise) {
            setError("Please start camera first");
            setStatusMessage("Error: Camera not active");
            return;
        }

        try {
            setLoading(true);
            setStatusMessage("Initializing training session...");

            if (isInvalidExercise) {
                // For reference exercises, just simulate training
                setIsTraining(true);
                setError(null);
                setStatusMessage("Reference exercise demonstration playing");
                dataIntervalRef.current = setInterval(() => {
                    setCount((prev) => Math.min(prev + 1, 10));
                }, 1000);
            } else {
                // For valid exercises, call the API
                const initResponse = await api.get("/start");

                if (initResponse.data) {
                    dataIntervalRef.current = setInterval(getTrainingData, 300);
                    setIsTraining(true);
                    setError(null);
                    setStatusMessage(
                        "Training session started - Begin your exercise"
                    );
                } else {
                    setError("Failed to start training session");
                    setStatusMessage("Failed to start training");
                }
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

            if (!isInvalidExercise) {
                const finishResponse = await api.get("/stop");
                if (!finishResponse.data) {
                    setError("Failed to properly end training session");
                    setStatusMessage("Error completing training");
                    return;
                }
            }

            setIsFinished(false);
            setIsTraining(false);
            setExercise(null);
            setStatusMessage("Training completed successfully!");
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
            if (isTraining && !isInvalidExercise) {
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
                        <option value="Select your training">
                            Select your training
                        </option>
                        {groupedExercises.map((group, index) => (
                            <optgroup key={index} label={group.label}>
                                {group.options.map((ex) => (
                                    <option key={ex} value={ex}>
                                        {ex}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                {/* Camera display or YouTube video */}
                <div className="mb-4 flex-1 flex flex-col">
                    {isInvalidExercise ? (
                        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`${
                                    invalidExercises[exercise].videoId
                                }?autoplay=${isTraining ? 1 : 0}`}
                                title={`${exercise} demonstration`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
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
                    )}

                    {/* Combined Camera and Training Controls */}
                    <div className="flex justify-between gap-4">
                        {!isInvalidExercise && (
                            <>
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
                            </>
                        )}

                        <button
                            onClick={startTraining}
                            disabled={
                                (!isCameraOn && !isInvalidExercise) ||
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
                                    {isInvalidExercise
                                        ? "Play Demo"
                                        : "Start Training"}
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

                {/* Training statistics - Only shown for valid exercises */}
                {!isInvalidExercise && (
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
                )}
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

                {/* Exercise Information */}
                {showExerciseInfo && (
                    <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 mb-6 shadow-lg">
                        <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                            <Icon
                                icon="mdi:dumbbell"
                                className="h-5 w-5 mr-2"
                            />
                            {exercise} Exercise
                        </h3>

                        {isInvalidExercise ? (
                            <>
                                <p className="text-white mb-4">
                                    {invalidExercises[exercise].description}
                                </p>
                                <p className="text-white text-sm italic">
                                    <Icon
                                        icon="mdi:information-outline"
                                        className="inline mr-1"
                                    />
                                    This is a reference exercise. Watch the
                                    video demonstration.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-white mb-4">
                                    Perform this exercise while the system
                                    tracks your form.
                                </p>
                                <p className="text-white text-sm italic">
                                    <Icon
                                        icon="mdi:information-outline"
                                        className="inline mr-1"
                                    />
                                    This is a trackable exercise. The camera
                                    will monitor your movements.
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* General Guidelines (shown when no exercise selected or after training) */}
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
                                    {isInvalidExercise
                                        ? "Watch the demonstration carefully before attempting"
                                        : "Position yourself 2-3 feet from camera"}
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
                                    {isInvalidExercise
                                        ? "Follow along with the video at your own pace"
                                        : "Ensure good lighting on your body"}
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

                {/* Progress Section - Only shown for valid exercises */}
                {!isInvalidExercise && (
                    <div className="bg-white bg-opacity-20 p-5 rounded-lg border border-white border-opacity-30 shadow-lg">
                        <h3 className="font-semibold text-lg text-white mb-3 flex items-center">
                            <Icon
                                icon="mdi:chart-line"
                                className="h-5 w-5 mr-2"
                            />
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
                )}
            </div>
        </div>
    );
}
