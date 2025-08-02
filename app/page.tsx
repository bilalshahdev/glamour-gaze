"use client";

import { AuthForm } from "@/components/auth/auth-form";
import FeaturedProducts from "@/components/FeaturedProducts";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/layout/footer";
import Hero from "@/components/layout/Hero";
import { Navbar } from "@/components/layout/navbar";
import { ImageUpload } from "@/components/makeup/image-upload";
import { LiveCamera } from "@/components/makeup/live-camera";
import { MakeupControls } from "@/components/makeup/makeup-controls";
import MakeupStudio from "@/components/MakeupStudio";
import { useToast } from "@/hooks/use-toast";
import { useMakeupStore } from "@/lib/stores/makeup-store";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimpleUserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
}

export default function HomePage() {
  const [user, setUser] = useState<SimpleUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentImage } = useMakeupStore();
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950">
        <div className="text-center animate-fadeInUp">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading Glamour Gaze...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleImageUpload = (imageData: string) => {
    console.log("Image uploaded:", imageData);
    useMakeupStore.getState().setCurrentImage(imageData); // assuming you have a set function like this
    toast({
      title: "Photo captured!",
      description: "Your captured image is ready for virtual makeup.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-pink-950 flex flex-col">
      <Navbar user={user} />
      <Hero />

      {/* Main Content */}
      <main className="max-w-7xl space-y-4 mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {!currentImage ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <FeaturedProducts />

            <div className="text-center animate-fadeInUp">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Try Virtual Makeup
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose how you want to begin — upload a photo or use live camera
              </p>
            </div>

            {/* TABS FROM SHADCN */}
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6 bg-card border shadow-sm">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="camera">Use Live Camera</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="animate-slideInLeft">
                    <ImageUpload />
                  </div>
                  <HowItWorks />
                </div>
              </TabsContent>

              <TabsContent value="camera">
                <LiveCamera onCapture={handleImageUpload} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <MakeupStudio />
        )}

        <MakeupControls />
      </main>

      <Footer />
    </div>
  );
}
