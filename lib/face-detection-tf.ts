import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl"
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection"
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

export class TensorFlowFaceDetector {
  private model: faceLandmarksDetection.FaceLandmarksDetector | null = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize TensorFlow.js backend
      await tf.ready()

      // Load the MediaPipe FaceMesh model
      this.model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "tfjs",
          refineLandmarks: true,
          maxFaces: 1,
        },
      )

      this.isInitialized = true
    } catch (error) {
      console.error("Failed to initialize face detector:", error)
      throw error
    }
  }

  async detectLandmarks(imageElement: HTMLImageElement): Promise<FaceLandmarks | null> {
    if (!this.model || !this.isInitialized) {
      await this.initialize()
    }

    if (!this.model) return null

    try {
      const predictions = await this.model.estimateFaces(imageElement)

      if (predictions.length > 0) {
        const face = predictions[0]
        const keypoints = face.keypoints

        if (keypoints && keypoints.length >= 468) {
          return this.extractFacialFeatures(keypoints, imageElement.width, imageElement.height)
        }
      }

      return null
    } catch (error) {
      console.error("Face detection error:", error)
      return null
    }
  }

  private extractFacialFeatures(keypoints: any[], width: number, height: number): FaceLandmarks {
    const extractPoints = (indices: number[]) => indices.map((i) => [keypoints[i]?.x || 0, keypoints[i]?.y || 0])

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

export const tensorFlowFaceDetector = new TensorFlowFaceDetector()
