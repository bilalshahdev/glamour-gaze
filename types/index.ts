export interface User {
  id: string
  email: string
  name: string
  age?: number
  created_at: string
  updated_at: string
}

export interface MakeupPreset {
  id: string
  name: string
  category: "lips" | "eyes" | "cheeks" | "eyebrows" | "hair"
  color: string
  opacity: number
  blend_mode: string
  created_at: string
}

export interface MakeupTrial {
  id: string
  user_id: string
  image_url?: string
  makeup_config: MakeupConfig
  created_at: string
}

export interface MakeupConfig {
  lips?: {
    color: string
    opacity: number
    blend_mode: string
  }
  eyes?: {
    color: string
    opacity: number
    blend_mode: string
  }
  cheeks?: {
    color: string
    opacity: number
    blend_mode: string
  }
  eyebrows?: {
    color: string
    opacity: number
    blend_mode: string
  }
  hair?: {
    color: string
    opacity: number
    blend_mode: string
  }
}

export interface FaceLandmarks {
  lips: number[][]
  leftEye: number[][]
  rightEye: number[][]
  leftCheek: number[][]
  rightCheek: number[][]
  leftEyebrow: number[][]
  rightEyebrow: number[][]
  face: number[][]
}

export interface UserProfile {
  id: string
  email: string
  name: string
  age?: number
  created_at: string
  updated_at: string
}
