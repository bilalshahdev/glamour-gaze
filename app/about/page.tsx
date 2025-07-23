"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Briefcase, Users, Award, Zap } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface SimpleUserProfile {
  id: string
  email: string
  name: string
  age?: number
}

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@glamourgaze.com",
    phone: "+1 (555) 123-4567",
    city: "San Francisco",
    country: "United States",
    role: "CEO & Co-Founder",
    bio: "Former beauty industry executive with 15+ years of experience. Passionate about democratizing beauty through technology and empowering people to express themselves confidently.",
    avatar: "/placeholder.svg?height=120&width=120",
    specialties: ["Beauty Industry", "Business Strategy", "Product Development"],
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@glamourgaze.com",
    phone: "+1 (555) 987-6543",
    city: "New York",
    country: "United States",
    role: "CTO & Co-Founder",
    bio: "AI/ML expert and former Google engineer. Specializes in computer vision, facial recognition technology, and building scalable AI systems that make beauty accessible to everyone.",
    avatar: "/placeholder.svg?height=120&width=120",
    specialties: ["AI/ML", "Computer Vision", "Software Architecture"],
  },
]

const companyStats = [
  { label: "Virtual Try-Ons", value: "2M+", icon: Users },
  { label: "Happy Customers", value: "500K+", icon: Award },
  { label: "Makeup Products", value: "100+", icon: Briefcase },
  { label: "Countries Served", value: "50+", icon: Globe },
]

export default function AboutPage() {
  const [user, setUser] = useState<SimpleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const setUserFromAuth = (authUser: SupabaseUser) => {
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
          <p className="text-foreground">Loading About...</p>
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInLeft">About Glamour Gaze</h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slideInRight">
            Revolutionizing beauty with AI-powered virtual try-on technology
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fadeInUp">
          {companyStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 text-center hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-fuchsia-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* About Section */}
        <div className="mb-16 animate-slideInLeft">
          <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-foreground">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Glamour Gaze</strong> was born from a simple yet powerful
                    vision: to make beauty accessible to everyone, everywhere. Founded in 2024, we recognized that
                    trying on makeup shouldn't require a trip to the store or expensive consultations.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our cutting-edge AI technology uses advanced facial recognition and computer vision to detect 468
                    precise facial landmarks, enabling realistic virtual makeup application that rivals in-person
                    try-ons.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    From lipstick to eyeshadow, blush to hair color, our platform empowers users to experiment with
                    different looks confidently and conveniently from the comfort of their homes.
                  </p>
                </div>
                <div className="glass rounded-2xl p-8 border border-fuchsia-200/20 dark:border-fuchsia-800/20">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                  <p className="text-muted-foreground mb-6">
                    To democratize beauty by providing innovative, accessible, and inclusive virtual try-on experiences
                    that help everyone discover their perfect look.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-fuchsia-600">2M+</div>
                      <div className="text-sm text-muted-foreground">Virtual Try-Ons</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">100+</div>
                      <div className="text-sm text-muted-foreground">Makeup Products</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-16 animate-slideInRight">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Founders</h2>
            <p className="text-lg text-muted-foreground">The visionaries behind Glamour Gaze</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={member.id}
                className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg hover-lift animate-fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-fuchsia-gradient p-1">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full bg-white"
                    />
                  </div>
                  <CardTitle className="text-2xl">{member.name}</CardTitle>
                  <Badge className="bg-fuchsia-gradient text-white">{member.role}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-center leading-relaxed">{member.bio}</p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/20 dark:text-fuchsia-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-fuchsia-200/20 dark:border-fuchsia-800/20">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-fuchsia-500" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 text-purple-500" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-pink-500" />
                      <span>
                        {member.city}, {member.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 text-fuchsia-600" />
                      <span>{member.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16 animate-fadeInUp">
          <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-foreground">Our Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
                  <div className="w-16 h-16 bg-fuchsia-gradient rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">AI Face Detection</h3>
                  <p className="text-muted-foreground">
                    Advanced machine learning algorithms detect 468 facial landmarks with 99.9% accuracy for precise
                    makeup application.
                  </p>
                </div>
                <div className="text-center animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
                  <div className="w-16 h-16 bg-fuchsia-gradient rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Real-time Rendering</h3>
                  <p className="text-muted-foreground">
                    Instant makeup application with realistic blending, color matching, and lighting effects for natural
                    results.
                  </p>
                </div>
                <div className="text-center animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
                  <div className="w-16 h-16 bg-fuchsia-gradient rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Cloud Processing</h3>
                  <p className="text-muted-foreground">
                    Scalable cloud infrastructure ensures fast processing, seamless user experience, and global
                    accessibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
