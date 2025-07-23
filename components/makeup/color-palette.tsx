"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { Palette, Sparkles } from "lucide-react"

// Comprehensive color palette with all shades
const colorPalettes = {
  lips: [
    // Reds
    { id: "1", name: "Classic Red", color: "#DC143C", opacity: 0.8, blend_mode: "multiply", price: "$24.99" },
    { id: "2", name: "Cherry Red", color: "#B22222", opacity: 0.8, blend_mode: "multiply", price: "$22.99" },
    { id: "3", name: "Ruby Red", color: "#E0115F", opacity: 0.8, blend_mode: "multiply", price: "$26.99" },
    { id: "4", name: "Wine Red", color: "#722F37", opacity: 0.9, blend_mode: "multiply", price: "$25.99" },

    // Pinks
    { id: "5", name: "Hot Pink", color: "#FF69B4", opacity: 0.7, blend_mode: "multiply", price: "$23.99" },
    { id: "6", name: "Rose Pink", color: "#FF91A4", opacity: 0.7, blend_mode: "multiply", price: "$24.99" },
    { id: "7", name: "Bubblegum", color: "#FF1493", opacity: 0.7, blend_mode: "multiply", price: "$21.99" },
    { id: "8", name: "Soft Pink", color: "#FFB6C1", opacity: 0.6, blend_mode: "multiply", price: "$20.99" },

    // Berries
    { id: "9", name: "Berry Bold", color: "#8B0000", opacity: 0.9, blend_mode: "multiply", price: "$27.99" },
    { id: "10", name: "Plum Berry", color: "#8E4585", opacity: 0.8, blend_mode: "multiply", price: "$25.99" },
    { id: "11", name: "Cranberry", color: "#9F2B68", opacity: 0.8, blend_mode: "multiply", price: "$24.99" },

    // Corals & Oranges
    { id: "12", name: "Coral Kiss", color: "#FF7F50", opacity: 0.7, blend_mode: "multiply", price: "$23.99" },
    { id: "13", name: "Peach Coral", color: "#FFCBA4", opacity: 0.6, blend_mode: "multiply", price: "$22.99" },
    { id: "14", name: "Orange Pop", color: "#FF6347", opacity: 0.7, blend_mode: "multiply", price: "$24.99" },

    // Nudes & Browns
    { id: "15", name: "Nude Rose", color: "#D2691E", opacity: 0.6, blend_mode: "multiply", price: "$26.99" },
    { id: "16", name: "Mauve", color: "#E0B4D6", opacity: 0.6, blend_mode: "multiply", price: "$25.99" },
    { id: "17", name: "Brown Sugar", color: "#A0522D", opacity: 0.7, blend_mode: "multiply", price: "$23.99" },
    { id: "18", name: "Caramel", color: "#CD853F", opacity: 0.6, blend_mode: "multiply", price: "$24.99" },

    // Purples
    { id: "19", name: "Purple Haze", color: "#9370DB", opacity: 0.8, blend_mode: "multiply", price: "$28.99" },
    { id: "20", name: "Lavender", color: "#E6E6FA", opacity: 0.6, blend_mode: "multiply", price: "$21.99" },
  ],

  eyes: [
    // Neutrals
    { id: "21", name: "Smoky Gray", color: "#696969", opacity: 0.6, blend_mode: "multiply", price: "$32.99" },
    { id: "22", name: "Charcoal", color: "#36454F", opacity: 0.7, blend_mode: "multiply", price: "$34.99" },
    { id: "23", name: "Taupe", color: "#483C32", opacity: 0.6, blend_mode: "multiply", price: "$30.99" },
    {
      id: "24",
      name: "Champagne",
      color: "#F7E7CE",
      opacity: 0.5,
      blend_mode: "overlay",
      shimmer: true,
      price: "$38.99",
    },

    // Golds
    {
      id: "25",
      name: "Golden Glow",
      color: "#FFD700",
      opacity: 0.5,
      blend_mode: "overlay",
      shimmer: true,
      price: "$42.99",
    },
    { id: "26", name: "Bronze Beauty", color: "#CD7F32", opacity: 0.6, blend_mode: "multiply", price: "$36.99" },
    { id: "27", name: "Copper", color: "#B87333", opacity: 0.6, blend_mode: "multiply", price: "$35.99" },
    {
      id: "28",
      name: "Rose Gold",
      color: "#E8B4B8",
      opacity: 0.5,
      blend_mode: "overlay",
      shimmer: true,
      price: "$44.99",
    },

    // Purples
    { id: "29", name: "Purple Haze", color: "#9370DB", opacity: 0.7, blend_mode: "multiply", price: "$33.99" },
    { id: "30", name: "Plum", color: "#8E4585", opacity: 0.7, blend_mode: "multiply", price: "$31.99" },
    { id: "31", name: "Violet", color: "#8A2BE2", opacity: 0.6, blend_mode: "multiply", price: "$34.99" },

    // Blues & Greens
    { id: "32", name: "Ocean Blue", color: "#006994", opacity: 0.6, blend_mode: "multiply", price: "$29.99" },
    { id: "33", name: "Emerald", color: "#50C878", opacity: 0.6, blend_mode: "multiply", price: "$37.99" },
    { id: "34", name: "Forest Green", color: "#228B22", opacity: 0.6, blend_mode: "multiply", price: "$33.99" },

    // Pinks
    { id: "35", name: "Rose Quartz", color: "#F7CAC9", opacity: 0.5, blend_mode: "overlay", price: "$31.99" },
    { id: "36", name: "Dusty Rose", color: "#DCAE96", opacity: 0.5, blend_mode: "multiply", price: "$30.99" },
  ],

  cheeks: [
    // Peaches
    { id: "37", name: "Peach Glow", color: "#FFCBA4", opacity: 0.5, blend_mode: "overlay", price: "$28.99" },
    { id: "38", name: "Coral Peach", color: "#FF9F80", opacity: 0.5, blend_mode: "overlay", price: "$27.99" },
    { id: "39", name: "Apricot", color: "#FBCEB1", opacity: 0.4, blend_mode: "overlay", price: "$26.99" },

    // Roses
    { id: "40", name: "Rose Petal", color: "#FF91A4", opacity: 0.6, blend_mode: "multiply", price: "$29.99" },
    { id: "41", name: "Dusty Rose", color: "#DCAE96", opacity: 0.5, blend_mode: "multiply", price: "$28.99" },
    { id: "42", name: "Mauve Rose", color: "#E0B4D6", opacity: 0.5, blend_mode: "multiply", price: "$30.99" },

    // Corals
    { id: "43", name: "Coral Flush", color: "#FF6B6B", opacity: 0.5, blend_mode: "multiply", price: "$27.99" },
    { id: "44", name: "Salmon", color: "#FA8072", opacity: 0.5, blend_mode: "multiply", price: "$26.99" },

    // Berries
    { id: "45", name: "Berry Blush", color: "#C44569", opacity: 0.6, blend_mode: "multiply", price: "$31.99" },
    { id: "46", name: "Raspberry", color: "#E30B5C", opacity: 0.5, blend_mode: "multiply", price: "$29.99" },
  ],

  eyebrows: [
    { id: "47", name: "Light Brown", color: "#A0522D", opacity: 0.7, blend_mode: "multiply", price: "$18.99" },
    { id: "48", name: "Medium Brown", color: "#8B4513", opacity: 0.8, blend_mode: "multiply", price: "$18.99" },
    { id: "49", name: "Dark Brown", color: "#654321", opacity: 0.9, blend_mode: "multiply", price: "$18.99" },
    { id: "50", name: "Black", color: "#000000", opacity: 0.9, blend_mode: "multiply", price: "$18.99" },
    { id: "51", name: "Ash Brown", color: "#6F4E37", opacity: 0.8, blend_mode: "multiply", price: "$19.99" },
    { id: "52", name: "Auburn", color: "#A52A2A", opacity: 0.8, blend_mode: "multiply", price: "$19.99" },
    { id: "53", name: "Blonde", color: "#DAA520", opacity: 0.6, blend_mode: "multiply", price: "$19.99" },
  ],

  hair: [
    // Browns
    { id: "54", name: "Chocolate Brown", color: "#3C2415", opacity: 0.8, blend_mode: "multiply", price: "$39.99" },
    { id: "55", name: "Chestnut", color: "#954535", opacity: 0.8, blend_mode: "multiply", price: "$37.99" },
    { id: "56", name: "Espresso", color: "#2F1B14", opacity: 0.9, blend_mode: "multiply", price: "$41.99" },

    // Blondes
    { id: "57", name: "Honey Blonde", color: "#DAA520", opacity: 0.7, blend_mode: "overlay", price: "$43.99" },
    { id: "58", name: "Platinum Blonde", color: "#E6E6FA", opacity: 0.6, blend_mode: "overlay", price: "$49.99" },
    { id: "59", name: "Strawberry Blonde", color: "#FF9999", opacity: 0.7, blend_mode: "overlay", price: "$45.99" },

    // Reds
    { id: "60", name: "Auburn Red", color: "#A0522D", opacity: 0.8, blend_mode: "multiply", price: "$42.99" },
    { id: "61", name: "Copper Red", color: "#B87333", opacity: 0.8, blend_mode: "multiply", price: "$44.99" },
    { id: "62", name: "Cherry Red", color: "#B22222", opacity: 0.8, blend_mode: "multiply", price: "$46.99" },

    // Blacks
    { id: "63", name: "Raven Black", color: "#000000", opacity: 0.9, blend_mode: "multiply", price: "$38.99" },
    { id: "64", name: "Blue Black", color: "#0F0F23", opacity: 0.9, blend_mode: "multiply", price: "$40.99" },

    // Fantasy Colors
    { id: "65", name: "Purple", color: "#8A2BE2", opacity: 0.8, blend_mode: "multiply", price: "$35.99" },
    { id: "66", name: "Pink", color: "#FF69B4", opacity: 0.8, blend_mode: "multiply", price: "$33.99" },
    { id: "67", name: "Blue", color: "#4169E1", opacity: 0.8, blend_mode: "multiply", price: "$34.99" },
  ],
}

interface MakeupPreset {
  id: string
  name: string
  color: string
  opacity: number
  blend_mode: string
  shimmer?: boolean
  price: string
}

export function ColorPalette() {
  const { selectedCategory, updateMakeupConfig, makeupConfig } = useMakeupStore()
  const [customOpacity, setCustomOpacity] = useState<number>(0.7)

  const filteredPresets = colorPalettes[selectedCategory as keyof typeof colorPalettes] || []

  const applyMakeup = (preset: MakeupPreset) => {
    updateMakeupConfig(selectedCategory as keyof typeof makeupConfig, {
      color: preset.color,
      opacity: customOpacity,
      blend_mode: preset.blend_mode,
      shimmer: preset.shimmer,
      gloss: selectedCategory === "lips" ? true : false,
    })
  }

  const removeMakeup = () => {
    updateMakeupConfig(selectedCategory as keyof typeof makeupConfig, null)
  }

  const currentMakeup = makeupConfig[selectedCategory as keyof typeof makeupConfig]

  if (filteredPresets.length === 0) {
    return (
      <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-fadeInUp">
        <CardContent className="p-6 text-center">
          <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No colors available for this category</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-slideInRight">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-fuchsia-500" />
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Colors
          </CardTitle>
          {currentMakeup && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeMakeup}
              className="text-fuchsia-600 hover:text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-50 dark:border-fuchsia-800 dark:hover:bg-fuchsia-950/20 hover-lift bg-transparent"
            >
              Remove
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Opacity Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Opacity: {Math.round(customOpacity * 100)}%</label>
          <Slider
            value={[customOpacity]}
            onValueChange={(value) => {
              setCustomOpacity(value[0])
              // Update current makeup if applied
              if (currentMakeup) {
                updateMakeupConfig(selectedCategory as keyof typeof makeupConfig, {
                  ...currentMakeup,
                  opacity: value[0],
                })
              }
            }}
            max={1}
            min={0.1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
          {filteredPresets.map((preset, index) => {
            const isActive = currentMakeup?.color === preset.color

            return (
              <Button
                key={preset.id}
                variant="outline"
                className={`
                  h-auto p-3 flex flex-col items-center gap-2 transition-all duration-300 w-full
                  border-fuchsia-200/50 dark:border-fuchsia-800/50 hover:shadow-md
                  ${isActive ? "ring-2 ring-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/20 border-fuchsia-300" : "hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:border-fuchsia-300"}
                `}
                onClick={() => applyMakeup(preset)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm ${preset.shimmer ? "animate-pulse-slow" : ""}`}
                  style={{ backgroundColor: preset.color }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium leading-tight">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">{preset.price}</p>
                  {isActive && (
                    <Badge
                      variant="secondary"
                      className="mt-1 text-xs bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300"
                    >
                      Applied
                    </Badge>
                  )}
                </div>
              </Button>
            )
          })}
        </div>

        <div className="pt-2 border-t border-fuchsia-200/20 dark:border-fuchsia-800/20">
          <p className="text-xs text-muted-foreground text-center">💄 Tap any color to try it instantly</p>
        </div>
      </CardContent>
    </Card>
  )
}
