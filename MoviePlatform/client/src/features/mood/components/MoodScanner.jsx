import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const MoodScanner = ({ onMoodDetected }) => {
    const webcamRef = useRef(null);
    const [faceLandmarker, setFaceLandmarker] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [status, setStatus] = useState("Initializing AI...");

    useEffect(() => {
        const init = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "IMAGE",
                    numFaces: 1
                });
                setFaceLandmarker(landmarker);
                setStatus("AI Ready");
            } catch (err) {
                console.error(err);
                setStatus("AI Error. Check Connection.");
            }
        };
        init();
    }, []);

    const analyzeMood = async () => {
        if (!faceLandmarker || !webcamRef.current) return;
        setIsLoading(true);
        setIsScanning(true);
        setStatus("Analyzing Facial Geometry...");

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) throw new Error("Capture Failed");

            const img = new Image();
            img.src = imageSrc;
            await img.decode();

            const result = faceLandmarker.detect(img);

            if (result.faceBlendshapes && result.faceBlendshapes.length > 0) {
                const shapes = result.faceBlendshapes[0].categories;
                const mood = getMood(shapes);
                onMoodDetected(mood);
                setIsLoading(false);
                setIsScanning(false);
                setStatus("Analysis Complete!");
            } else {
                setStatus("No Face Detected! Please Center Yourself.");
                setIsLoading(false);
                setIsScanning(false);
            }
        } catch (err) {
            console.error(err);
            setStatus("Scan Error. Try Again.");
            setIsLoading(false);
            setIsScanning(false);
        }
    };

    const getMood = (shapes) => {
        const score = (n) => shapes.find(s => s.categoryName === n)?.score || 0;

        // Comprehensive Scoring Definitions
        const smile = (score('mouthSmileLeft') + score('mouthSmileRight')) / 2;
        const browDown = (score('browDownLeft') + score('browDownRight')) / 2;
        const noseSneer = (score('noseSneerLeft') + score('noseSneerRight')) / 2;
        const eyeWide = (score('eyeWideLeft') + score('eyeWideRight')) / 2;
        const jawOpen = score('jawOpen');
        const browInnerUp = score('browInnerUp');
        const mouthFrown = (score('mouthFrownLeft') + score('mouthFrownRight')) / 2;
        const mouthPucker = score('mouthPucker');

        // Hierarchy logic (most distinct first)
        if (eyeWide > 0.4 || jawOpen > 0.3) return "Surprised";
        if (smile > 0.3) return "Happy";
        if (browDown > 0.4 || noseSneer > 0.4) return "Angry";
        if (browInnerUp > 0.35 || mouthFrown > 0.2 || mouthPucker > 0.2) return "Sad";

        return "Neutral";
    };

    return (
        <div className="relative group">
            {/* Camera Container */}
            <div className="relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/5 bg-black/40 shadow-2xl shadow-violet-500/10 transition-transform duration-700 hover:shadow-violet-500/20 group-hover:scale-[1.02]">

                {/* Scanning Frame / Guide */}
                <div className="absolute inset-8 border border-white/10 rounded-[2rem] z-10 pointer-events-none flex flex-col items-center justify-between py-6">
                    <div className="w-16 h-1 bg-white/20 rounded-full"></div>
                    <div className="flex justify-between w-full px-6">
                        <div className="w-1 h-8 bg-white/20 rounded-full"></div>
                        <div className="w-1 h-8 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="w-16 h-1 bg-white/20 rounded-full"></div>
                </div>

                {/* Laser Scanning Effect */}
                {isScanning && (
                    <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent z-20 animate-scanner pointer-events-none flex items-center justify-center">
                        <div className="w-full h-px bg-violet-400 shadow-[0_0_20px_4px_rgba(139,92,246,0.8)]"></div>
                    </div>
                )}

                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover scale-x-[-1]"
                    videoConstraints={{ facingMode: "user" }}
                />

                {/* Overlays */}
                {(isLoading || !faceLandmarker) && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl">
                        <div className="w-16 h-16 relative">
                            <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 font-bold text-violet-400 animate-pulse text-sm tracking-widest uppercase">{status}</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-10 flex flex-col items-center w-full px-4 sm:px-0">
                <button
                    onClick={analyzeMood}
                    disabled={isLoading || !faceLandmarker}
                    className="group relative w-full sm:w-auto px-6 py-4 md:px-12 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-[15px] md:text-lg tracking-[0.2em] uppercase transition-all duration-500 disabled:opacity-50 border border-violet-500/20 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-violet-600/20 backdrop-blur-xl transition-all duration-500 group-hover:bg-violet-600/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4 text-white drop-shadow-md">
                        <i className={`ri-focus-3-line text-xl md:text-2xl ${isScanning ? 'animate-spin text-violet-300' : 'group-hover:scale-110 transition-transform text-violet-400'}`}></i>
                        {isScanning ? 'ANALYZING' : 'INITIATE SCAN'}
                    </span>
                </button>
                <p className="mt-6 text-[10px] font-black text-textSub/50 uppercase tracking-[0.3em]">
                    AI MOOD MAPPING • VERSION 2.0
                </p>
            </div>

            <style>{`
                @keyframes scanner {
                    0% { top: -20%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 120%; opacity: 0; }
                }
                .animate-scanner {
                    animation: scanner 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default MoodScanner;
