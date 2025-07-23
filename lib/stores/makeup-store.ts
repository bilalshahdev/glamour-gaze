import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MakeupConfig, MakeupPreset, FaceLandmarks } from "@/types"

interface SavedLook {
  id: string
  name: string
  imageUrl: string
  makeupConfig: MakeupConfig
  createdAt: string
}

interface MakeupStore {
  // State
  currentImage: string | null
  faceLandmarks: FaceLandmarks | null
  makeupConfig: MakeupConfig
  makeupPresets: MakeupPreset[]
  selectedCategory: string
  isProcessing: boolean
  savedLooks: SavedLook[]

  // Actions
  setCurrentImage: (image: string | null) => void
  setFaceLandmarks: (landmarks: FaceLandmarks | null) => void
  updateMakeupConfig: (category: keyof MakeupConfig, config: any) => void
  setMakeupPresets: (presets: MakeupPreset[]) => void
  setSelectedCategory: (category: string) => void
  setIsProcessing: (processing: boolean) => void
  resetMakeup: () => void
  saveLook: (name: string, imageUrl: string) => void
  deleteSavedLook: (id: string) => void
}

export const useMakeupStore = create<MakeupStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentImage: null,
      faceLandmarks: null,
      makeupConfig: {},
      makeupPresets: [],
      selectedCategory: "lips",
      isProcessing: false,
      savedLooks: [],

      // Actions
      setCurrentImage: (image) => set({ currentImage: image }),

      setFaceLandmarks: (landmarks) => set({ faceLandmarks: landmarks }),

      updateMakeupConfig: (category, config) =>
        set((state) => ({
          makeupConfig: {
            ...state.makeupConfig,
            [category]: config,
          },
        })),

      setMakeupPresets: (presets) => set({ makeupPresets: presets }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setIsProcessing: (processing) => set({ isProcessing: processing }),

      resetMakeup: () => set({ makeupConfig: {} }),

      saveLook: (name, imageUrl) =>
        set((state) => ({
          savedLooks: [
            ...state.savedLooks,
            {
              id: `look-${Date.now()}`,
              name,
              imageUrl,
              makeupConfig: { ...state.makeupConfig },
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteSavedLook: (id) =>
        set((state) => ({
          savedLooks: state.savedLooks.filter((look) => look.id !== id),
        })),
    }),
    {
      name: "makeup-storage",
      partialize: (state) => ({
        savedLooks: state.savedLooks,
      }),
    },
  ),
)
