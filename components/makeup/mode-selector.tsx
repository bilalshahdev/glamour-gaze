"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";

interface ModeSelectorProps {
  mode: "upload" | "live";
  onModeChange: (mode: "upload" | "live") => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={mode === "upload" ? "default" : "outline"}
            onClick={() => onModeChange("upload")}
            className={`flex items-center gap-2 ${
              mode === "upload"
                ? "bg-fuchsia-gradient text-white"
                : "border-fuchsia-200 hover:bg-fuchsia-50 dark:border-fuchsia-800 dark:hover:bg-fuchsia-950/20"
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload Photo
          </Button>
          <Button
            variant={mode === "live" ? "default" : "outline"}
            onClick={() => onModeChange("live")}
            className={`flex items-center gap-2 ${
              mode === "live"
                ? "bg-fuchsia-gradient text-white"
                : "border-fuchsia-200 hover:bg-fuchsia-50 dark:border-fuchsia-800 dark:hover:bg-fuchsia-950/20"
            }`}
          >
            <Camera className="h-4 w-4" />
            Live Camera
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
