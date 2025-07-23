"use client"

import { Button } from "@/components/ui/button"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { Palette, Eye, Heart, Brush, Scissors } from "lucide-react"

const categories = [
  { id: "lips", name: "Lips", icon: Heart, color: "text-rose-600" },
  { id: "eyes", name: "Eyes", icon: Eye, color: "text-orange-600" },
  { id: "cheeks", name: "Cheeks", icon: Palette, color: "text-amber-600" },
  { id: "eyebrows", name: "Brows", icon: Brush, color: "text-rose-700" },
  { id: "hair", name: "Hair", icon: Scissors, color: "text-orange-700" },
]

export function CategorySelector() {
  const { selectedCategory, setSelectedCategory } = useMakeupStore()

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const Icon = category.icon
        const isSelected = selectedCategory === category.id

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`
              w-full flex items-center gap-3 justify-start transition-all
              ${
                isSelected
                  ? "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-lg"
                  : "hover:border-rose-300 hover:bg-rose-50 border-rose-200"
              }
            `}
          >
            <Icon className={`h-4 w-4 ${isSelected ? "text-white" : category.color}`} />
            <span className={isSelected ? "text-white font-medium" : "text-gray-700"}>{category.name}</span>
          </Button>
        )
      })}
    </div>
  )
}
