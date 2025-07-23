// Use the correct MediaPipe Face Mesh import
declare global {
  interface Window {
    FaceMesh: any
  }
}

import type { FaceLandmarks } from "@/types"

// MediaPipe FaceMesh landmark indices for different facial features
const FACE_LANDMARKS = {
  // Lips outer boundary
  LIPS_OUTER: [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318],
  // Lips inner boundary
  LIPS_INNER: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415],

  // Left eye
  LEFT_EYE: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],

  // Right eye
  RIGHT_EYE: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],

  // Left eyebrow
  LEFT_EYEBROW: [46, 53, 52, 51, 48, 115, 131, 134, 102, 49, 220, 305],

  // Right eyebrow
  RIGHT_EYEBROW: [276, 283, 282, 295, 285, 336, 296, 334, 293, 300, 276, 353],

  // Left cheek
  LEFT_CHEEK: [116, 117, 118, 119, 120, 121, 126, 142, 36, 205, 206, 207, 213, 192, 147],

  // Right cheek
  RIGHT_CHEEK: [345, 346, 347, 348, 349, 350, 451, 452, 453, 464, 435, 410, 454, 323, 366],

  // Face contour
  FACE_OVAL: [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150,
    136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
  ],
}

export class FaceDetector {
  private faceMesh: any = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    // Load MediaPipe Face Mesh from CDN
    if (typeof window !== "undefined") {
      // Load the Face Mesh script
      await this.loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js")
      await this.loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js")
      await this.loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js")
      await this.loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js")

      // Initialize Face Mesh
      this.faceMesh = new window.FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      })

      this.faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      this.isInitialized = true
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = src
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async detectLandmarks(imageElement: HTMLImageElement): Promise<FaceLandmarks | null> {
    if (!this.faceMesh || !this.isInitialized) {
      await this.initialize()
    }

    return new Promise((resolve) => {
      if (!this.faceMesh) {
        resolve(null)
        return
      }

      this.faceMesh.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0]
          const faceLandmarks = this.extractFacialFeatures(landmarks, imageElement.width, imageElement.height)
          resolve(faceLandmarks)
        } else {
          resolve(null)
        }
      })

      this.faceMesh.send({ image: imageElement })
    })
  }

  private extractFacialFeatures(landmarks: any[], width: number, height: number): FaceLandmarks {
    const extractPoints = (indices: number[]) => indices.map((i) => [landmarks[i].x * width, landmarks[i].y * height])

    return {
      lips: [...extractPoints(FACE_LANDMARKS.LIPS_OUTER), ...extractPoints(FACE_LANDMARKS.LIPS_INNER)],
      leftEye: extractPoints(FACE_LANDMARKS.LEFT_EYE),
      rightEye: extractPoints(FACE_LANDMARKS.RIGHT_EYE),
      leftCheek: extractPoints(FACE_LANDMARKS.LEFT_CHEEK),
      rightCheek: extractPoints(FACE_LANDMARKS.RIGHT_CHEEK),
      leftEyebrow: extractPoints(FACE_LANDMARKS.LEFT_EYEBROW),
      rightEyebrow: extractPoints(FACE_LANDMARKS.RIGHT_EYEBROW),
      face: extractPoints(FACE_LANDMARKS.FACE_OVAL),
    }
  }
}

export const faceDetector = new FaceDetector()
