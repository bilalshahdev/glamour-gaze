"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Eye, Menu, X, LogOut, User, Palette, Info, Home, Moon, Sun, Package } from "lucide-react"
import { CartSidebar } from "@/components/cart/cart-sidebar"

interface NavbarProps {
  user?: {
    id: string
    email: string
    name: string
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Signed Out Successfully",
        description: "You have been signed out. See you next time!",
      })
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navLinks = [
    { href: "/", label: "Try-On Studio", icon: Home },
    { href: "/products", label: "Products", icon: Palette },
    { href: "/orders", label: "Orders", icon: Package },
    { href: "/about", label: "About", icon: Info },
  ]

  return (
    <nav className="bg-background/85 backdrop-blur border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 animate-slideInLeft">
            <div className="p-2 bg-fuchsia-gradient rounded-xl shadow-lg hover-lift">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Glamour Gaze
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Beauty Studio</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 animate-fadeInUp h-full">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 border-b-2 h-full border-transparent transition-all text-sm ${
                    isActive
                      ? "text-signature border-signature font-medium"
                      : "text-foreground hover:text-signature"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 animate-slideInRight">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <CartSidebar />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 text-sm text-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50 hover:border-fuchsia-300 dark:border-fuchsia-800 dark:text-fuchsia-300 dark:hover:bg-fuchsia-950/20 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  {/* <span className="hidden sm:inline">Sign Out</span> */}
                </Button>
              </div>
            ) : (
              <Link href="/">
                <Button className="bg-fuchsia-gradient hover:opacity-90 text-white hover-lift">Get Started</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-fadeInUp">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-fuchsia-gradient text-white font-medium"
                        : "text-foreground hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
