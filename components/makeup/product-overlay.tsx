"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { ShoppingBag, Star } from "lucide-react"

// Sample products that match applied makeup
const productSuggestions = {
  lips: [
    { name: "Velvet Matte Lipstick", price: "$24.99", rating: 4.8, brand: "Glamour Gaze" },
    { name: "Glossy Lip Tint", price: "$19.99", rating: 4.6, brand: "Glamour Gaze" },
  ],
  eyes: [
    { name: "Shimmer Eyeshadow Palette", price: "$45.99", rating: 4.9, brand: "Glamour Gaze" },
    { name: "Cream Eyeshadow Stick", price: "$28.99", rating: 4.7, brand: "Glamour Gaze" },
  ],
  cheeks: [
    { name: "Blush Powder Compact", price: "$29.99", rating: 4.8, brand: "Glamour Gaze" },
    { name: "Cream Blush Stick", price: "$26.99", rating: 4.6, brand: "Glamour Gaze" },
  ],
  eyebrows: [
    { name: "Brow Defining Pencil", price: "$18.99", rating: 4.5, brand: "Glamour Gaze" },
    { name: "Brow Gel", price: "$21.99", rating: 4.7, brand: "Glamour Gaze" },
  ],
  hair: [
    { name: "Temporary Hair Color", price: "$39.99", rating: 4.4, brand: "Glamour Gaze" },
    { name: "Hair Chalk Set", price: "$24.99", rating: 4.3, brand: "Glamour Gaze" },
  ],
}

export function ProductOverlay() {
  const { makeupConfig, currentImage } = useMakeupStore()

  const appliedCategories = Object.keys(makeupConfig).filter(
    (category) => makeupConfig[category as keyof typeof makeupConfig] !== null,
  )

  if (!currentImage || appliedCategories.length === 0) {
    return null
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-fadeInUp">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-fuchsia-500" />
              Suggested Products
            </h3>
            <Badge
              variant="secondary"
              className="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300"
            >
              {appliedCategories.length} applied
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {appliedCategories.slice(0, 2).map((category) => {
              const products = productSuggestions[category as keyof typeof productSuggestions] || []
              const product = products[0]

              if (!product) return null

              return (
                <div
                  key={category}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-black/20 border border-fuchsia-200/30 dark:border-fuchsia-800/30"
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: makeupConfig[category as keyof typeof makeupConfig]?.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-fuchsia-600">{product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-auto border-fuchsia-200 hover:bg-fuchsia-50 dark:border-fuchsia-800 dark:hover:bg-fuchsia-950/20 bg-transparent"
                  >
                    Buy
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
