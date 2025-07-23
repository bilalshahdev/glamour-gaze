"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ImageUpload } from "@/components/makeup/image-upload"
import { MakeupCanvas } from "@/components/makeup/makeup-canvas"
import { CategorySelector } from "@/components/makeup/category-selector"
import { ColorPalette } from "@/components/makeup/color-palette"
import { MakeupControls } from "@/components/makeup/makeup-controls"
import { AppliedMakeupList } from "@/components/makeup/applied-makeup-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Upload, Download, Wand2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SimpleUserProfile {
  id: string
  email: string
  name: string
  age?: number
}

export default function HomePage() {
  const [user, setUser] = useState<SimpleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { currentImage } = useMakeupStore()
  const { toast } = useToast()

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950">
        <div className="text-center animate-fadeInUp">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading Glamour Gaze...</p>
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

      {/* Hero Section - Remove hover effects */}
      <div className="hero-section bg-fuchsia-gradient dark:bg-fuchsia-gradient-dark text-white py-12 animate-fadeInUp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInLeft">Transform Your Look</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 animate-slideInRight">
            AI-powered virtual makeup try-on experience
          </p>
          <div
            className="flex flex-wrap justify-center gap-8 text-sm animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <span>Upload Photo</span>
            </div>
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              <span>Apply Makeup</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <span>Download Result</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {!currentImage ? (
          /* Upload Section with Featured Products */
          <div className="max-w-4xl mx-auto">
            {/* Featured Products Section - Move this above upload */}
            <div className="mb-16 animate-fadeInUp">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
                <p className="text-lg text-muted-foreground">Discover our premium makeup collection</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { name: "Velvet Matte Lipstick", price: "$24.99", color: "#DC143C", category: "Lips" },
                  { name: "Golden Hour Eyeshadow", price: "$28.99", color: "#FFD700", category: "Eyes" },
                  { name: "Peachy Keen Blush", price: "$29.99", color: "#FFCBA4", category: "Cheeks" },
                ].map((product, index) => (
                  <Card
                    key={product.name}
                    className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg hover-lift animate-fadeInUp bg-white/80 dark:bg-gray-800/80"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className="w-16 h-16 rounded-full border-2 border-white shadow-lg mx-auto mb-4"
                        style={{ backgroundColor: product.color }}
                      />
                      <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <p className="text-lg font-bold text-foreground">{product.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link href="/products">
                  <Button className="bg-fuchsia-gradient hover:opacity-90 text-white hover-lift">
                    View All Products
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Upload Section */}
            <div className="text-center mb-8 animate-fadeInUp">
              <h2 className="text-3xl font-bold text-foreground mb-4">Try Virtual Makeup</h2>
              <p className="text-lg text-muted-foreground">
                Upload your photo to begin your virtual makeup transformation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="animate-slideInLeft">
                <ImageUpload />
              </div>
              <div className="space-y-6 animate-slideInRight">
                <div className="glass rounded-2xl p-6 shadow-lg border border-fuchsia-200/20 dark:border-fuchsia-800/20">
                  <h3 className="text-xl font-semibold text-foreground mb-4">How it works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
                      <div className="w-8 h-8 bg-fuchsia-gradient text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Upload Your Photo</h4>
                        <p className="text-muted-foreground text-sm">
                          Choose a clear, front-facing photo with good lighting
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
                      <div className="w-8 h-8 bg-fuchsia-gradient text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">AI Face Detection</h4>
                        <p className="text-muted-foreground text-sm">
                          Our AI detects 468 facial landmarks for precise makeup application
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
                      <div className="w-8 h-8 bg-fuchsia-gradient text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Try Different Looks</h4>
                        <p className="text-muted-foreground text-sm">
                          Experiment with lipstick, eyeshadow, blush, and more
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Makeup Studio */
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="xl:col-span-1 space-y-4 animate-slideInLeft">
              <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-foreground text-sm">
                    <Sparkles className="h-4 w-4 text-fuchsia-500" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategorySelector />
                </CardContent>
              </Card>

              <AppliedMakeupList />
              <MakeupControls />
            </div>

            {/* Center - Canvas */}
            <div className="xl:col-span-3 animate-fadeInUp">
              <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <MakeupCanvas />
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Colors */}
            <div className="xl:col-span-1 color-palette-container">
              <ColorPalette />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
