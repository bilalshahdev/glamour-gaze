"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { tensorFlowFaceDetector } from "@/lib/face-detection-tf"
import { Upload, ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImageUpload() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const { setCurrentImage, setFaceLandmarks, setIsProcessing: setStoreProcessing } = useMakeupStore()
  const { toast } = useToast()

  const processImage = async (file: File) => {
    setIsProcessing(true)
    setStoreProcessing(true)
    setUploadStatus("processing")

    try {
      // Create image URL
      const imageUrl = URL.createObjectURL(file)

      // Create image element for processing
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = async () => {
        try {
          console.log("Image loaded, detecting landmarks...")

          // Detect face landmarks
          const landmarks = await tensorFlowFaceDetector.detectLandmarks(img)

          if (landmarks) {
            console.log("Landmarks detected:", landmarks)
            setCurrentImage(imageUrl)
            setFaceLandmarks(landmarks)
            setUploadStatus("success")

            toast({
              title: "Face detected! ✨",
              description: "Ready to apply makeup. Choose a category to get started.",
            })
          } else {
            console.log("No landmarks detected")
            setUploadStatus("error")
            toast({
              title: "No face detected 😔",
              description: "Please upload an image with a clear, front-facing face.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Face detection error:", error)
          setUploadStatus("error")
          toast({
            title: "Processing error",
            description: "Failed to process the image. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsProcessing(false)
          setStoreProcessing(false)
        }
      }

      img.onerror = () => {
        console.error("Image load error")
        setUploadStatus("error")
        toast({
          title: "Invalid image",
          description: "Please upload a valid image file.",
          variant: "destructive",
        })
        setIsProcessing(false)
        setStoreProcessing(false)
      }

      img.src = imageUrl
    } catch (error) {
      console.error("Image processing error:", error)
      setUploadStatus("error")
      toast({
        title: "Upload error",
        description: "Failed to upload the image. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
      setStoreProcessing(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      console.log("File dropped:", file.name, file.size, file.type)
      processImage(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "processing":
        return <Loader2 className="h-12 w-12 text-rose-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case "error":
        return <AlertCircle className="h-12 w-12 text-red-500" />
      default:
        return isDragActive ? (
          <Upload className="h-12 w-12 text-rose-600" />
        ) : (
          <ImageIcon className="h-12 w-12 text-rose-600" />
        )
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case "processing":
        return {
          title: "Processing image...",
          subtitle: "Detecting facial landmarks with AI",
        }
      case "success":
        return {
          title: "Face detected successfully!",
          subtitle: "Ready to apply virtual makeup",
        }
      case "error":
        return {
          title: "Upload failed",
          subtitle: "Please try again with a different image",
        }
      default:
        return {
          title: isDragActive ? "Drop your image here" : "Upload your photo",
          subtitle: "Drag & drop or click to select • JPG, PNG, WebP • Max 10MB",
        }
    }
  }

  const statusText = getStatusText()

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive ? "border-rose-500 bg-rose-50 scale-105" : "border-rose-200 hover:border-rose-400"}
            ${isProcessing ? "pointer-events-none opacity-75" : ""}
            ${uploadStatus === "success" ? "border-green-400 bg-green-50" : ""}
            ${uploadStatus === "error" ? "border-red-400 bg-red-50" : ""}
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 rounded-full">
              {getStatusIcon()}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium">{statusText.title}</p>
              <p className="text-sm text-muted-foreground">{statusText.subtitle}</p>
            </div>

            {uploadStatus === "idle" && (
              <Button
                variant="outline"
                className="mt-4 border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 bg-transparent"
              >
                Choose File
              </Button>
            )}

            {uploadStatus === "error" && (
              <Button
                variant="outline"
                className="mt-4 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 bg-transparent"
                onClick={() => setUploadStatus("idle")}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>💡 For best results, use a clear, front-facing photo with good lighting</p>
        </div>
      </CardContent>
    </Card>
  )
}
