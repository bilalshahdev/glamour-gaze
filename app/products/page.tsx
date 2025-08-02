"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productCategories, products } from "@/data";
import { useCartStore } from "@/lib/stores/cart-store";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ShoppingBag, ShoppingCart, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SimpleUserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
}

// Product categories

export default function ProductsPage() {
  const [user, setUser] = useState<SimpleUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("lips");

  const { addItem } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserFromAuth(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserFromAuth(session.user);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserFromAuth = (authUser: User) => {
    const userProfile: SimpleUserProfile = {
      id: authUser.id,
      email: authUser.email || "",
      name:
        authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      age: authUser.user_metadata?.age || undefined,
    };

    setUser(userProfile);
  };

  const handleTryVirtual = (product: any) => {
    router.push("/");
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      brand: product.brand,
      price: product.price,
      color: product.color,
      category: selectedCategory,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950">
        <div className="text-center animate-fadeInUp">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading Products...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950 flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="bg-fuchsia-gradient dark:bg-fuchsia-gradient-dark text-white py-16 animate-fadeInUp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInLeft">
            Our Products
          </h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slideInRight">
            Discover our premium makeup collection
          </p>
          <div
            className="flex items-center justify-center gap-2 mt-6 animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-lg">
              Premium Quality • Cruelty-Free • Vegan
            </span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 glass shadow-lg border border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-slideInLeft">
            {productCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 data-[state=active]:bg-fuchsia-gradient data-[state=active]:text-fuchsia-500 hover:text-fuchsia-500 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(products).map(([categoryId, categoryProducts]) => (
            <TabsContent key={categoryId} value={categoryId} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryProducts.map((product: any, index: number) => (
                  <Card
                    key={product.id}
                    className="glass p-4 border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="relative p-0">
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
                      <div className="flex items-center justify-between">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: product.color }}
                        />
                        <Badge
                          variant="outline"
                          className="border-fuchsia-200 mt-8 text-fuchsia-700 dark:border-fuchsia-800 dark:text-fuchsia-300"
                        >
                          {product.brand}
                        </Badge>
                      </div>

                      {/* Product Name */}
                      <CardTitle className="text-base leading-tight">
                        {product.name}
                      </CardTitle>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 p-0 mt-1">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {product.features
                          ?.slice(0, 2)
                          .map((feature: any, idx: any) => (
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
                      <div className="flex items-center justify-between pt-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-foreground">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
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
  );
}
