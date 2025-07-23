"use client"

import type React from "react"

import { useState } from "react"
import * as z from "zod"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Eye, AlertCircle } from "lucide-react"

/* ────────────────────────────
   Schemas
   ──────────────────────────── */
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  age: z.coerce
    .number({ invalid_type_error: "Age is required" })
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
})

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type SignUpData = z.infer<typeof signUpSchema>
type SignInData = z.infer<typeof signInSchema>

/* ────────────────────────────
   Component
   ──────────────────────────── */
export function AuthForm() {
  const { toast } = useToast()
  const [tab, setTab] = useState<"signin" | "signup">("signin")
  const [loading, setLoading] = useState(false)

  /* form state  */
  const [signUpValues, setSignUpValues] = useState<SignUpData>({
    name: "",
    age: 18,
    email: "",
    password: "",
  })
  const [signInValues, setSignInValues] = useState<SignInData>({
    email: "",
    password: "",
  })

  /* validation errors */
  const [errors, setErrors] = useState<Record<string, string>>({})

  /* helpers */
  const handleInput = (form: "signup" | "signin", field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Clear errors when user starts typing
    setErrors((prev) => ({ ...prev, [field]: "" }))

    if (form === "signup") {
      setSignUpValues((s) => ({ ...s, [field]: field === "age" ? Number(val) || 0 : val }))
    } else {
      setSignInValues((s) => ({ ...s, [field]: val }))
    }
  }

  /* sign-up submit */
  const submitSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    const parsed = signUpSchema.safeParse(signUpValues)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setErrors(fieldErrors as any)

      // Show validation error toast
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form and try again.",
        variant: "destructive",
      })
      return
    }

    setErrors({})
    setLoading(true)

    try {
      console.log("Attempting to sign up user:", signUpValues.email)

      const { data, error } = await supabase.auth.signUp({
        email: signUpValues.email,
        password: signUpValues.password,
        options: {
          data: {
            name: signUpValues.name,
            age: signUpValues.age,
          },
        },
      })

      console.log("Sign up response:", { data, error })

      if (error) {
        console.error("Sign up error:", error)
        throw error
      }

      // Success toast
      toast({
        title: "Account Created Successfully! ✨",
        description:
          "Please check your email and click the confirmation link to verify your account before signing in.",
      })

      // Reset form and switch to sign in
      setSignUpValues({ name: "", age: 18, email: "", password: "" })
      setTab("signin")
    } catch (err: any) {
      console.error("Sign up error:", err)

      let errorMessage = "An unexpected error occurred. Please try again."

      if (err.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please try signing in instead."
      } else if (err.message?.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address."
      } else if (err.message?.includes("Password")) {
        errorMessage = "Password must be at least 6 characters long."
      } else if (err.message) {
        errorMessage = err.message
      }

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  /* sign-in submit */
  const submitSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    const parsed = signInSchema.safeParse(signInValues)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setErrors(fieldErrors as any)

      // Show validation error toast
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form and try again.",
        variant: "destructive",
      })
      return
    }

    setErrors({})
    setLoading(true)

    try {
      console.log("Attempting to sign in user:", signInValues.email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInValues.email,
        password: signInValues.password,
      })

      console.log("Sign in response:", { data, error })

      if (error) {
        console.error("Sign in error:", error)
        throw error
      }

      // Success toast
      toast({
        title: "Welcome Back! 💄",
        description: "You have been signed in successfully. Get ready to transform your look!",
      })
    } catch (err: any) {
      console.error("Sign in error:", err)

      let errorMessage = "Invalid email or password. Please check your credentials and try again."

      if (err.message?.includes("Email not confirmed")) {
        errorMessage =
          "Please check your email and click the confirmation link to verify your account before signing in."
      } else if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again."
      } else if (err.message?.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please wait a moment and try again."
      } else if (err.message) {
        errorMessage = err.message
      }

      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  /* UI */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-2xl shadow-lg">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Glamour Gaze
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Transform your look with AI-powered makeup magic
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* ─────────── Sign-In ─────────── */}
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={submitSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={signInValues.email}
                    onChange={handleInput("signin", "email")}
                    className={`border-gray-200 focus:border-rose-500 focus:ring-rose-500 ${
                      errors.email ? "border-rose-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={signInValues.password}
                    onChange={handleInput("signin", "password")}
                    className={`border-gray-200 focus:border-rose-500 focus:ring-rose-500 ${
                      errors.password ? "border-rose-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 text-white font-medium py-2.5"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            {/* ─────────── Sign-Up ─────────── */}
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={submitSignUp} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpValues.name}
                    onChange={handleInput("signup", "name")}
                    className={`border-gray-200 focus:border-rose-500 focus:ring-rose-500 ${
                      errors.name ? "border-rose-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={signUpValues.age || ""}
                    onChange={handleInput("signup", "age")}
                    min="13"
                    max="120"
                    className={`border-gray-200 focus:border-rose-500 focus:ring-rose-500 ${
                      errors.age ? "border-rose-500" : ""
                    }`}
                  />
                  {errors.age && (
                    <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.age}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={signUpValues.email}
                    onChange={handleInput("signup", "email")}
                    className={`border-gray-200 focus:border-rose-500 focus:ring-rose-500 ${
                      errors.email ? "border-rose-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={signUpValues.password}
                    onChange={handleInput("signup", "password")}
                    className={`border-gray-200 focus:border-rose-500 focus:ring-rose-500 ${
                      errors.password ? "border-rose-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 text-white font-medium py-2.5"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
