"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMakeupStore } from "@/lib/stores/makeup-store";
import imageCompression from "browser-image-compression";
import { tensorFlowFaceDetector } from "@/lib/face-detection-tf";

interface LiveCameraProps {
  onCapture: (imageData: string) => void;
}

export function LiveCamera({ onCapture }: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false);

  const { toast } = useToast();
  const {
    setCurrentImage,
    setFaceLandmarks,
    setIsProcessing: setStoreProcessing,
  } = useMakeupStore();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasUserStarted(true); // ✅ mark as clicked
      }
    } catch (err) {
      setError("Failed to access camera. Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.error("Video or canvas element not found.");
      return;
    }

    setIsProcessing(true);
    setStoreProcessing(true);
    video.pause();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL("image/jpeg");

    toast({
      title: "📸 Photo captured!",
      description: "Analyzing your face...",
    });

    setTimeout(async () => {
      try {
        const blob = await (await fetch(base64Image)).blob();
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });

        const imageUrl = URL.createObjectURL(compressed);
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = async () => {
          try {
            const landmarks = await tensorFlowFaceDetector.detectLandmarks(img);
            if (landmarks) {
              setCurrentImage(imageUrl);
              setFaceLandmarks(landmarks);
              onCapture(imageUrl);
              toast({
                title: "Face detected! ✨",
                description: "Your captured image is ready for virtual makeup.",
              });
            } else {
              URL.revokeObjectURL(imageUrl);
              toast({
                title: "No face detected 😔",
                description: "Please ensure your face is visible and well-lit.",
                variant: "destructive",
              });
              resumeCamera();
            }
          } catch (err) {
            URL.revokeObjectURL(imageUrl);
            toast({
              title: "Processing failed",
              description: "Could not analyze the photo. Try again.",
              variant: "destructive",
            });
            resumeCamera();
          } finally {
            setIsProcessing(false);
            setStoreProcessing(false);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          toast({
            title: "Image error",
            description: "Could not read the captured image.",
            variant: "destructive",
          });
          resumeCamera();
          setIsProcessing(false);
          setStoreProcessing(false);
        };

        img.src = imageUrl;
      } catch (error) {
        toast({
          title: "Capture error",
          description: "Something went wrong while capturing.",
          variant: "destructive",
        });
        resumeCamera();
        setIsProcessing(false);
        setStoreProcessing(false);
      }
    }, 3000);
  };

  const resumeCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack.readyState === "live") {
        video.play().catch(console.error);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "c" || e.key === "C") && isReady && !isProcessing) {
        captureImage();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isProcessing, isReady]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <Camera className="h-12 w-12 text-red-500 mb-2" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  const isMobilePortrait =
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
      : false;

  // className={`object-cover w-full ${isMobilePortrait ? "h-[80vh]" : "aspect-video"}`}

  return (
    <div
      className={`relative  rounded-lg overflow-hidden ${
        isMobilePortrait ? "h-[80vh]" : "aspect-video"
      }`}
    >
      {!isStreamStarted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
          <button
            onClick={startCamera}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-pink-600 transition"
          >
            Start Camera
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        onCanPlay={() => {
          setIsStreamStarted(true);
          setIsReady(true); // ✅ ensure camera is ready
        }}
        className="w-full h-full object-cover scale-x-[-1]"
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {isProcessing && (
        <div className="absolute inset-0 bg-white/70 animate-pulse z-50 pointer-events-none" />
      )}

      {isStreamStarted && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={captureImage}
            disabled={isProcessing || !isReady}
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
              isProcessing
                ? "border-gray-300 bg-gray-200 cursor-not-allowed"
                : "border-white bg-white/80 hover:bg-white"
            }`}
            aria-label="Capture photo"
            role="button"
          >
            <Camera className="h-6 w-6 text-black" />
          </button>
        </div>
      )}
    </div>
  );
}
