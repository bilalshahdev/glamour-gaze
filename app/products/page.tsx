"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Eye, Palette, Brush, Scissors, Star, ShoppingBag, Sparkles, ShoppingCart } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { useCartStore } from "@/lib/stores/cart-store"
import { useRouter } from "next/navigation"

interface SimpleUserProfile {
  id: string
  email: string
  name: string
  age?: number
}

// Product categories
const productCategories = [
  { id: "lips", name: "Lips", icon: Heart, color: "text-fuchsia-600" },
  { id: "eyes", name: "Eyes", icon: Eye, color: "text-purple-600" },
  { id: "cheeks", name: "Cheeks", icon: Palette, color: "text-pink-600" },
  { id: "eyebrows", name: "Brows", icon: Brush, color: "text-fuchsia-700" },
  { id: "hair", name: "Hair", icon: Scissors, color: "text-purple-700" },
]

// Enhanced product data with better presentation
const products = {
  lips: [
    {
      id: 1,
      name: "Velvet Matte Lipstick",
      brand: "Glamour Gaze Pro",
      price: "$24.99",
      originalPrice: "$32.99",
      color: "#DC143C",
      rating: 4.8,
      reviews: 1247,
      description: "Long-lasting matte finish with intense color payoff. Enriched with vitamin E.",
      features: ["16-hour wear", "Transfer-proof", "Vitamin E enriched"],
      bestseller: true,
    },
    {
      id: 2,
      name: "Glossy Lip Tint",
      brand: "Glamour Gaze",
      price: "$19.99",
      color: "#FF69B4",
      rating: 4.6,
      reviews: 892,
      description: "Natural-looking tint with high-shine finish that lasts all day.",
      features: ["All-day wear", "Moisturizing", "Natural finish"],
    },
    {
      id: 3,
      name: "Liquid Lipstick Set",
      brand: "Glamour Gaze Pro",
      price: "$45.99",
      originalPrice: "$59.99",
      color: "#8B0000",
      rating: 4.9,
      reviews: 1456,
      description: "Set of 6 rich, velvety liquid lipsticks with full coverage.",
      features: ["6 shades included", "Velvety texture", "Full coverage"],
      newArrival: true,
    },
    {
      id: 4,
      name: "Plumping Lip Gloss",
      brand: "Glamour Gaze",
      price: "$22.99",
      color: "#FF7F50",
      rating: 4.5,
      reviews: 634,
      description: "High-shine gloss with plumping effect and moisturizing formula.",
      features: ["Plumping effect", "High shine", "Moisturizing"],
    },
  ],
  eyes: [
    {
      id: 5,
      name: "Smoky Eye Palette",
      brand: "Glamour Gaze Pro",
      price: "$45.99",
      originalPrice: "$55.99",
      color: "#696969",
      rating: 4.9,
      reviews: 2134,
      description: "12-shade palette with smoky grays and shimmers for dramatic looks.",
      features: ["12 shades", "Highly pigmented", "Blendable formula"],
      bestseller: true,
    },
    {
      id: 6,
      name: "Golden Hour Eyeshadow",
      brand: "Glamour Gaze",
      price: "$28.99",
      color: "#FFD700",
      rating: 4.7,
      reviews: 1089,
      description: "Shimmery golden eyeshadow with smooth, buildable coverage.",
      features: ["Shimmer finish", "Buildable", "Long-wearing"],
    },
    {
      id: 7,
      name: "Purple Dreams Palette",
      brand: "Glamour Gaze Pro",
      price: "$42.99",
      color: "#9370DB",
      rating: 4.8,
      reviews: 756,
      description: "8-shade purple palette from light lavender to deep plum.",
      features: ["8 purple shades", "Matte & shimmer", "Crease-resistant"],
      newArrival: true,
    },
    {
      id: 8,
      name: "Bronze Goddess Stick",
      brand: "Glamour Gaze",
      price: "$26.99",
      color: "#CD7F32",
      rating: 4.6,
      reviews: 943,
      description: "Convenient stick format for easy bronze eyeshadow application.",
      features: ["Stick format", "Easy application", "Creamy texture"],
    },
  ],
  cheeks: [
    {
      id: 9,
      name: "Peachy Keen Blush",
      brand: "Glamour Gaze Pro",
      price: "$29.99",
      color: "#FFCBA4",
      rating: 4.8,
      reviews: 1234,
      description: "Natural peachy glow with buildable coverage and silky texture.",
      features: ["Buildable coverage", "Silky texture", "Natural glow"],
      bestseller: true,
    },
    {
      id: 10,
      name: "Rose Petal Powder",
      brand: "Glamour Gaze",
      price: "$34.99",
      color: "#FF91A4",
      rating: 4.7,
      reviews: 1567,
      description: "Finely milled powder blush for a soft, natural flush of color.",
      features: ["Finely milled", "Natural finish", "Long-lasting"],
    },
    {
      id: 11,
      name: "Coral Cream Blush",
      brand: "Glamour Gaze",
      price: "$27.99",
      color: "#FF6B6B",
      rating: 4.6,
      reviews: 892,
      description: "Cream formula that melts into skin for a natural, dewy finish.",
      features: ["Cream formula", "Dewy finish", "Blendable"],
    },
  ],
  eyebrows: [
    {
      id: 12,
      name: "Precision Brow Pencil",
      brand: "Glamour Gaze Pro",
      price: "$18.99",
      color: "#8B4513",
      rating: 4.7,
      reviews: 1023,
      description: "Ultra-fine tip for precise, hair-like strokes that look natural.",
      features: ["Ultra-fine tip", "Natural finish", "Long-wearing"],
      bestseller: true,
    },
    {
      id: 13,
      name: "Brow Gel & Pencil Duo",
      brand: "Glamour Gaze",
      price: "$32.99",
      originalPrice: "$39.99",
      color: "#654321",
      rating: 4.8,
      reviews: 678,
      description: "Complete brow kit with defining pencil and setting gel.",
      features: ["2-in-1 kit", "Defining pencil", "Setting gel"],
    },
  ],
  hair: [
    {
      id: 14,
      name: "Temporary Hair Color Kit",
      brand: "Glamour Gaze Pro",
      price: "$39.99",
      color: "#3C2415",
      rating: 4.5,
      reviews: 456,
      description: "Easy-to-use temporary hair color that washes out completely.",
      features: ["Temporary", "Easy application", "Washes out"],
    },
    {
      id: 15,
      name: "Hair Chalk Set",
      brand: "Glamour Gaze",
      price: "$24.99",
      color: "#DAA520",
      rating: 4.3,
      reviews: 789,
      description: "Set of 6 vibrant hair chalks for temporary color highlights.",
      features: ["6 colors", "Temporary", "Easy to use"],
      newArrival: true,
    },
  ],
}

export default function ProductsPage() {
  const [user, setUser] = useState<SimpleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("lips")

  const { addItem } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserFromAuth(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUserFromAuth(session.user)
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const setUserFromAuth = (authUser: User) => {
    const userProfile: SimpleUserProfile = {
      id: authUser.id,
      email: authUser.email || "",
      name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      age: authUser.user_metadata?.age || undefined,
    }

    setUser(userProfile)
  }

  const handleTryVirtual = (product: any) => {
    router.push("/")
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      brand: product.brand,
      price: product.price,
      color: product.color,
      category: selectedCategory,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950">
        <div className="text-center animate-fadeInUp">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading Products...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950 flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="bg-fuchsia-gradient dark:bg-fuchsia-gradient-dark text-white py-16 animate-fadeInUp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInLeft">Our Products</h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slideInRight">Discover our premium makeup collection</p>
          <div
            className="flex items-center justify-center gap-2 mt-6 animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-lg">Premium Quality • Cruelty-Free • Vegan</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5 glass shadow-lg border border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-slideInLeft">
            {productCategories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 data-[state=active]:bg-fuchsia-gradient data-[state=active]:text-white transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(products).map(([categoryId, categoryProducts]) => (
            <TabsContent key={categoryId} value={categoryId} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product, index) => (
                  <Card
                    key={product.id}
                    className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-4 relative">
                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {product.bestseller && (
                          <Badge className="bg-fuchsia-gradient text-white text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Bestseller
                          </Badge>
                        )}
                        {product.newArrival && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 text-xs"
                          >
                            New
                          </Badge>
                        )}
                      </div>

                      {/* Product Color & Brand */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: product.color }}
                        />
                        <Badge
                          variant="outline"
                          className="border-fuchsia-200 text-fuchsia-700 dark:border-fuchsia-800 dark:text-fuchsia-300"
                        >
                          {product.brand}
                        </Badge>
                      </div>

                      {/* Product Name */}
                      <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {product.features?.slice(0, 2).map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/20 dark:text-fuchsia-300"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-foreground">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleTryVirtual(product)}
                            className="flex-1 bg-fuchsia-gradient hover:opacity-90 text-white hover-lift"
                          >
                            Try Virtual
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleAddToCart(product)}
                            className="border-fuchsia-200 hover:bg-fuchsia-50 dark:border-fuchsia-800 dark:hover:bg-fuchsia-950/20"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
