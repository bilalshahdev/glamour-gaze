"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { X, Palette } from "lucide-react"

// Quick apply colors for each category
const quickApplyColors = {
  lips: [
    { name: "Red", color: "#DC143C", opacity: 0.8, blend_mode: "multiply" },
    { name: "Pink", color: "#FF69B4", opacity: 0.7, blend_mode: "multiply" },
    { name: "Berry", color: "#8B0000", opacity: 0.9, blend_mode: "multiply" },
    { name: "Coral", color: "#FF7F50", opacity: 0.7, blend_mode: "multiply" },
  ],
  eyes: [
    { name: "Gold", color: "#FFD700", opacity: 0.5, blend_mode: "overlay", shimmer: true },
    { name: "Brown", color: "#8B4513", opacity: 0.6, blend_mode: "multiply" },
    { name: "Purple", color: "#9370DB", opacity: 0.7, blend_mode: "multiply" },
    { name: "Gray", color: "#696969", opacity: 0.6, blend_mode: "multiply" },
  ],
  cheeks: [
    { name: "Peach", color: "#FFCBA4", opacity: 0.5, blend_mode: "overlay" },
    { name: "Rose", color: "#FF91A4", opacity: 0.6, blend_mode: "multiply" },
    { name: "Coral", color: "#FF6B6B", opacity: 0.5, blend_mode: "multiply" },
    { name: "Berry", color: "#C44569", opacity: 0.6, blend_mode: "multiply" },
  ],
  eyebrows: [
    { name: "Light", color: "#A0522D", opacity: 0.7, blend_mode: "multiply" },
    { name: "Medium", color: "#8B4513", opacity: 0.8, blend_mode: "multiply" },
    { name: "Dark", color: "#654321", opacity: 0.9, blend_mode: "multiply" },
    { name: "Black", color: "#000000", opacity: 0.9, blend_mode: "multiply" },
  ],
  hair: [
    { name: "Brown", color: "#3C2415", opacity: 0.8, blend_mode: "multiply" },
    { name: "Blonde", color: "#DAA520", opacity: 0.7, blend_mode: "overlay" },
    { name: "Red", color: "#A0522D", opacity: 0.8, blend_mode: "multiply" },
    { name: "Black", color: "#000000", opacity: 0.9, blend_mode: "multiply" },
  ],
}

export function QuickApplyOverlay() {
  const { currentImage, makeupConfig, updateMakeupConfig } = useMakeupStore()

  if (!currentImage) return null

  const applyQuickMakeup = (category: string, config: any) => {
    updateMakeupConfig(category as keyof typeof makeupConfig, {
      ...config,
      gloss: category === "lips" ? true : false,
    })
  }

  const removeCategory = (category: string) => {
    updateMakeupConfig(category as keyof typeof makeupConfig, null)
  }

  const appliedCategories = Object.keys(makeupConfig).filter(
    (category) => makeupConfig[category as keyof typeof makeupConfig] !== null,
  )

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-fadeInUp">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4 text-fuchsia-500" />
              Quick Apply
            </h3>
            {appliedCategories.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300 text-xs"
              >
                {appliedCategories.length} applied
              </Badge>
            )}
          </div>

          {/* Applied makeup with remove buttons */}
          {appliedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-fuchsia-200/20 dark:border-fuchsia-800/20">
              {appliedCategories.map((category) => {
                const config = makeupConfig[category as keyof typeof makeupConfig]
                return (
                  <div
                    key={category}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-fuchsia-50/80 dark:bg-fuchsia-950/30 border border-fuchsia-200/30 dark:border-fuchsia-800/30"
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-white"
                      style={{ backgroundColor: config?.color }}
                    />
                    <span className="text-xs font-medium capitalize">{category}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(category)}
                      className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-950/20 hover:text-red-600"
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Quick apply categories */}
          <div className="space-y-2">
            {Object.entries(quickApplyColors).map(([category, colors]) => (
              <div key={category} className="flex items-center gap-2">
                <span className="text-xs font-medium capitalize w-16 text-muted-foreground">{category}:</span>
                <div className="flex gap-1 flex-1">
                  {colors.map((colorConfig) => {
                    const isActive = makeupConfig[category as keyof typeof makeupConfig]?.color === colorConfig.color
                    return (
                      <Button
                        key={colorConfig.name}
                        variant="outline"
                        size="sm"
                        onClick={() => applyQuickMakeup(category, colorConfig)}
                        className={`h-6 w-6 p-0 rounded-full border-2 transition-all ${
                          isActive
                            ? "ring-2 ring-fuchsia-500 border-white scale-110"
                            : "border-white/50 hover:border-white hover:scale-105"
                        }`}
                        style={{ backgroundColor: colorConfig.color }}
                        title={`${category} - ${colorConfig.name}`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
