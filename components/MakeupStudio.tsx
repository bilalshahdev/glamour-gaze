"use client";

import { AppliedMakeupList } from "@/components/makeup/applied-makeup-list";
import { CategorySelector } from "@/components/makeup/category-selector";
import { ColorPalette } from "@/components/makeup/color-palette";
import { MakeupCanvas } from "@/components/makeup/makeup-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMakeupStore } from "@/lib/stores/makeup-store";
import { Sparkles, Trash2 } from "lucide-react";

const MakeupStudio = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Left Sidebar - Controls */}
      <div className="xl:col-span-1 space-y-4 animate-slideInLeft">
        <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground text-sm">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySelector />
          </CardContent>
        </Card>

        <AppliedMakeupList />

        <div className="text-center">
          <Button
            variant="destructive"
            className="w-full mt-4"
            onClick={() => useMakeupStore.getState().setCurrentImage(null)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove / Reselect Photo
          </Button>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="xl:col-span-3 animate-fadeInUp">
        <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <MakeupCanvas />
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Colors */}
      <div className="xl:col-span-1 color-palette-container">
        <ColorPalette />
      </div>
    </div>
  );
};

export default MakeupStudio;
