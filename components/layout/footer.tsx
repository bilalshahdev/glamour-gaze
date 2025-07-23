"use client"

import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-fuchsia-gradient dark:bg-fuchsia-gradient-dark text-white py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span>© 2024 Glamour Gaze. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-pink-200 animate-pulse" />
            <span>by AI Beauty Studio</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
