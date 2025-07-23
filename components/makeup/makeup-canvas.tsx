"use client"

import { useEffect, useRef, useState } from "react"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { MakeupRenderer } from "@/lib/makeup-renderer"
import { Loader2 } from "lucide-react"

export function MakeupCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const rendererRef = useRef<MakeupRenderer | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const { currentImage, faceLandmarks, makeupConfig } = useMakeupStore()

  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new MakeupRenderer(canvasRef.current)
    }
  }, [])

  useEffect(() => {
    if (currentImage && imageRef.current) {
      setIsImageLoaded(false)
      imageRef.current.src = currentImage
    }
  }, [currentImage])

  useEffect(() => {
    if (imageRef.current && canvasRef.current && faceLandmarks && rendererRef.current && isImageLoaded) {
      const img = imageRef.current
      const canvas = canvasRef.current

      // Set canvas to natural image size for better quality
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      // Calculate display size to fit container while maintaining aspect ratio
      const containerWidth = canvas.parentElement?.clientWidth || 600
      const maxWidth = Math.min(containerWidth - 32, 600) // Account for padding
      const maxHeight = 500

      let displayWidth = img.naturalWidth
      let displayHeight = img.naturalHeight

      // Scale down if too large
      if (displayWidth > maxWidth) {
        displayHeight = (displayHeight * maxWidth) / displayWidth
        displayWidth = maxWidth
      }

      if (displayHeight > maxHeight) {
        displayWidth = (displayWidth * maxHeight) / displayHeight
        displayHeight = maxHeight
      }

      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`

      // Render makeup
      rendererRef.current.drawMakeup(img, faceLandmarks, makeupConfig)
    }
  }, [faceLandmarks, makeupConfig, isImageLoaded])

  const handleImageLoad = () => {
    console.log("Image loaded in canvas component")
    setIsImageLoaded(true)
  }

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950/20 dark:to-purple-950/20 rounded-xl border-2 border-dashed border-fuchsia-200 dark:border-fuchsia-800 animate-pulse-slow">
        <div className="text-center animate-fadeInUp">
          <div className="w-16 h-16 bg-fuchsia-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-foreground text-lg font-medium">Upload an image to get started</p>
          <p className="text-muted-foreground text-sm mt-2">Your virtual makeup preview will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <img
        ref={imageRef}
        src={currentImage || "/placeholder.svg"}
        alt="Original"
        className="hidden"
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
      />

      <div className="flex justify-center relative">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto rounded-xl shadow-lg border border-fuchsia-200/50 dark:border-fuchsia-800/50 animate-fadeInUp"
          style={{ maxHeight: "500px" }}
        />
      </div>

      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center glass rounded-xl">
          <div className="text-center animate-fadeInUp">
            <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500 mx-auto mb-2" />
            <p className="text-sm text-foreground">Loading image...</p>
          </div>
        </div>
      )}

      {isImageLoaded && !faceLandmarks && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-white text-center animate-fadeInUp">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-lg font-medium">Processing...</p>
            <p className="text-sm opacity-75">Detecting facial features</p>
          </div>
        </div>
      )}
    </div>
  )
}
