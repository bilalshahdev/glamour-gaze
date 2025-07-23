"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/lib/stores/cart-store"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, CreditCard, Truck, MapPin } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface SimpleUserProfile {
  id: string
  email: string
  name: string
  age?: number
}

export default function CheckoutPage() {
  const [user, setUser] = useState<SimpleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const { items, getTotal, checkout } = useCartStore()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    paymentMethod: "cod",
  })

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

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products")
    }
  }, [items, router])

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
    setFormData((prev) => ({ ...prev, name: userProfile.name }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.address || !formData.city || !formData.zipCode || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      checkout({
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
      })

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Your order has been confirmed. ${formData.paymentMethod === "cod" ? "You will pay on delivery." : "Payment confirmation pending."}`,
      })

      router.push("/orders")
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center animate-fadeInUp">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading Checkout...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (items.length === 0) {
    return null // Will redirect to products
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="bg-fuchsia-gradient dark:bg-fuchsia-gradient-dark text-white py-16 animate-fadeInUp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInLeft">Checkout</h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slideInRight">Complete your beauty purchase</p>
        </div>
      </div>

      {/* Checkout Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg animate-slideInLeft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-fuchsia-500" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-fuchsia-50/50 dark:bg-fuchsia-950/20"
                  >
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{item.price}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({items.length}):</span>
                  <span className="text-foreground">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="text-green-600 dark:text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="text-foreground">Total:</span>
                  <span className="text-foreground">${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg animate-slideInRight">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-fuchsia-500" />
                Shipping & Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Address
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white dark:bg-gray-800 border-fuchsia-200 dark:border-fuchsia-800 text-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-foreground">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="bg-white dark:bg-gray-800 border-fuchsia-200 dark:border-fuchsia-800 text-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-foreground">
                          City *
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="bg-white dark:bg-gray-800 border-fuchsia-200 dark:border-fuchsia-800 text-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-foreground">
                          ZIP Code *
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="bg-white dark:bg-gray-800 border-fuchsia-200 dark:border-fuchsia-800 text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="bg-white dark:bg-gray-800 border-fuchsia-200 dark:border-fuchsia-800 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-fuchsia-500" />
                    Payment Method
                  </h3>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800 bg-white dark:bg-gray-800">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer text-foreground">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-fuchsia-500" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pay when your order arrives</p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800 bg-white dark:bg-gray-800">
                      <RadioGroupItem value="digital" id="digital" />
                      <Label htmlFor="digital" className="flex-1 cursor-pointer text-foreground">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-fuchsia-500" />
                          <span className="font-medium">Digital Payment</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Credit/Debit Card, UPI, Net Banking</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-fuchsia-gradient hover:opacity-90 text-white py-3 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Order...
                    </div>
                  ) : (
                    `Place Order - $${getTotal().toFixed(2)}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
