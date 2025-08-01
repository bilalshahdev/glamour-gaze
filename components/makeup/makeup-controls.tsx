"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMakeupStore } from "@/lib/stores/makeup-store"
import { useToast } from "@/hooks/use-toast"
import { Download, Save, RotateCcw, Share2, ImageIcon, Trash2 } from "lucide-react"

export function MakeupControls() {
  const { makeupConfig, resetMakeup, currentImage, saveLook, savedLooks, deleteSavedLook } = useMakeupStore()
  const { toast } = useToast()
  const [saveName, setSaveName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSavedLooksOpen, setIsSavedLooksOpen] = useState(false)

  const saveTrial = async () => {
    const canvas = document.querySelector("canvas")
    if (!canvas || !saveName.trim()) {
      toast({
        title: "Cannot Save",
        description: "Please enter a name for your look and ensure you have an image.",
        variant: "destructive",
      })
      return
    }

    try {
      // Convert canvas to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          saveLook(saveName.trim(), imageUrl)

          toast({
            title: "Look Saved! ✨",
            description: `"${saveName}" has been saved to your gallery.`,
          })

          setSaveName("")
          setIsDialogOpen(false)
        }
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your look. Please try again.",
        variant: "destructive",
      })
    }
  }

  const downloadImage = () => {
    const canvas = document.querySelector("canvas")
    if (!canvas) {
      toast({
        title: "No image to download",
        description: "Please upload an image and apply makeup first.",
        variant: "destructive",
      })
      return
    }

    const link = document.createElement("a")
    link.download = `glamour-gaze-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Image downloaded! 📸",
      description: "Your makeup trial has been saved to your device.",
    })
  }

  const shareImage = async () => {
    const canvas = document.querySelector("canvas")
    if (!canvas) {
      toast({
        title: "No image to share",
        description: "Please upload an image and apply makeup first.",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if Web Share API is supported and available
      if (!navigator.share) {
        // Fallback: copy to clipboard
        canvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard && navigator.clipboard.write) {
            try {
              await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
              toast({
                title: "Copied to clipboard! 📋",
                description: "Your makeup trial image has been copied.",
              })
            } catch (clipboardError) {
              // Final fallback: download
              downloadImage()
            }
          } else {
            // Final fallback: download
            downloadImage()
          }
        })
        return
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const file = new File([blob], "glamour-gaze-trial.png", { type: "image/png" })
            await navigator.share({
              title: "My Glamour Gaze Makeover",
              text: "Check out my virtual makeup look! ✨",
              files: [file],
            })
          } catch (shareError: any) {
            if (shareError.name === "NotAllowedError") {
              // User cancelled or permission denied, try clipboard
              if (navigator.clipboard && navigator.clipboard.write) {
                try {
                  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
                  toast({
                    title: "Copied to clipboard! 📋",
                    description: "Your makeup trial image has been copied.",
                  })
                } catch (clipboardError) {
                  downloadImage()
                }
              } else {
                downloadImage()
              }
            } else {
              throw shareError
            }
          }
        }
      })
    } catch (error) {
      console.error("Share error:", error)
      toast({
        title: "Share not available",
        description: "Downloading image instead.",
      })
      downloadImage()
    }
  }

  const deleteLook = (id: string) => {
    deleteSavedLook(id)
    toast({
      title: "Look Deleted",
      description: "The saved look has been removed from your gallery.",
    })
  }

  const hasAnyMakeup = Object.keys(makeupConfig).length > 0

  return (
    <>
      <Card className="border-rose-100 shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
            <Button
              variant="outline"
              size="sm"
              onClick={resetMakeup}
              disabled={!hasAnyMakeup}
              className="flex items-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasAnyMakeup}
                  className="flex items-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 bg-transparent"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Your Look</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter a name for your look..."
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveTrial} disabled={!saveName.trim()} className="flex-1">
                      Save Look
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
         

          {/* <div className="grid grid-cols-2 gap-2"> */}
            <Button
              size="sm"
              onClick={downloadImage}
              disabled={!currentImage}
              className="flex items-center gap-2 bg-fuchsia-gradient text-white"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={shareImage}
              disabled={!currentImage}
              className="flex items-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button> </div>
          {/* </div> */}

          <Dialog open={isSavedLooksOpen} onOpenChange={setIsSavedLooksOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 bg-transparent"
              >
                <ImageIcon className="h-4 w-4" />
                Gallery ({savedLooks.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Saved Looks</DialogTitle>
              </DialogHeader>
              {savedLooks.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No saved looks yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {savedLooks.map((look) => (
                    <div key={look.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={look.imageUrl || "/placeholder.svg"}
                          alt={look.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="font-medium text-sm truncate">{look.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(look.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteLook(look.id)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="pt-2 border-t border-rose-100 text-xs text-gray-600 text-center">
            {hasAnyMakeup ? (
              <p>✨ Makeup applied! Use controls above to save or share.</p>
            ) : (
              <p>💄 Select colors from the palette to apply makeup.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
