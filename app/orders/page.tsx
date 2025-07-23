"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/stores/cart-store"
import { Package, Calendar, DollarSign, ShoppingBag, CreditCard } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SimpleUserProfile {
  id: string
  email: string
  name: string
  age?: number
}

export default function OrdersPage() {
  const [user, setUser] = useState<SimpleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { orders, cancelOrder } = useCartStore()

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-950/50 dark:text-gray-300"
    }
  }

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId)
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled successfully.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center animate-fadeInUp">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading Orders...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="bg-fuchsia-gradient dark:bg-fuchsia-gradient-dark text-white py-16 animate-fadeInUp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInLeft">Your Orders</h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slideInRight">Track your beauty purchases</p>
        </div>
      </div>

      {/* Orders Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {orders.length === 0 ? (
          <div className="text-center py-16 animate-fadeInUp">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <Card
                key={order.id}
                className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Package className="h-5 w-5 text-fuchsia-500" />
                      Order #{order.id.split("-")[1]}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />${order.total.toFixed(2)}
                    </div>
                    {order.paymentMethod && (
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Digital Payment"}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-fuchsia-50/50 dark:bg-fuchsia-950/20"
                      >
                        <div
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.price}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {order.shippingAddress && (
                  <div className="mt-4 p-3 rounded-lg bg-fuchsia-50/30 dark:bg-fuchsia-950/10 border border-fuchsia-200/30 dark:border-fuchsia-800/30">
                    <h4 className="font-medium text-foreground mb-2">Shipping Address:</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.name}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                      <br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
