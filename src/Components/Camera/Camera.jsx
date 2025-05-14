import React, { useState, useRef, useEffect } from "react";

export default function Camera ({
    onCameraStart,
    onCameraStop,
    showDeviceSelection = true,
}) {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);

    // Get available camera devices
    const getCameraDevices = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true }); // Needed to get device labels
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
            );
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDevice(videoDevices[0].deviceId);
            }
        } catch (err) {
            handleCameraError(err);
        }
    };

    // Start camera with selected device
    const startCamera = async () => {
        try {
            setError(null);
            const constraints = {
                video: {
                    deviceId: selectedDevice
                        ? { exact: selectedDevice }
                        : undefined,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: selectedDevice ? undefined : "user",
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(
                constraints
            );
            setStream(stream);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current
                        .play()
                        .then(() => {
                            setIsCameraOn(true);
                            if (onCameraStart) onCameraStart(stream);
                        })
                        .catch((err) => handleCameraError(err));
                };
            }
        } catch (err) {
            handleCameraError(err);
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
            if (onCameraStop) onCameraStop();
        }
    };

    // Handle camera errors
    const handleCameraError = (err) => {
        console.error("Camera Error:", err);
        let errorMessage = "Camera Error: ";

        switch (err.name) {
            case "NotAllowedError":
                errorMessage +=
                    "Permission denied. Please allow camera access.";
                break;
            case "NotFoundError":
                errorMessage += "No camera device found.";
                break;
            case "NotReadableError":
                errorMessage +=
                    "Camera is already in use by another application.";
                break;
            case "OverconstrainedError":
                errorMessage += "Camera constraints could not be satisfied.";
                break;
            default:
                errorMessage += err.message;
        }

        setError(errorMessage);
        setIsCameraOn(false);
    };

    // Initialize cameras on component mount
    useEffect(() => {
        getCameraDevices();
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="w-full">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                    <div className="flex justify-between items-center">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-700 hover:text-red-900 font-bold text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                        Camera is not active
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {showDeviceSelection && devices.length > 0 && (
                    <select
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        disabled={isCameraOn}
                    >
                        {devices.map((device) => (
                            <option
                                key={device.deviceId}
                                value={device.deviceId}
                            >
                                {device.label ||
                                    `Camera ${devices.indexOf(device) + 1}`}
                            </option>
                        ))}
                    </select>
                )}

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
    );
};
