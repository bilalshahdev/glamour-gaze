"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMakeupStore } from "@/lib/stores/makeup-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useToast } from "@/hooks/use-toast";
import { X, Palette, ShoppingCart, Plus } from "lucide-react";

// Product mapping for applied makeup
const productMapping = {
  lips: { name: "Lipstick", basePrice: 24.99 },
  eyes: { name: "Eyeshadow", basePrice: 32.99 },
  cheeks: { name: "Blush", basePrice: 28.99 },
  eyebrows: { name: "Brow Pencil", basePrice: 18.99 },
  hair: { name: "Hair Color", basePrice: 39.99 },
};

export function AppliedMakeupList() {
  const { makeupConfig, updateMakeupConfig } = useMakeupStore();
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const appliedItems = Object.entries(makeupConfig).filter(
    ([_, config]) => config !== null
  );

  const removeMakeupItem = (category: string) => {
    updateMakeupConfig(category as keyof typeof makeupConfig, null);
  };

  const addToCart = (category: string, config: any) => {
    const product = productMapping[category as keyof typeof productMapping];
    if (!product) return;

    addItem({
      id: `applied-${category}-${Date.now()}`,
      name: product.name,
      brand: "Glamour Gaze",
      price: `$${product.basePrice}`,
      color: config.color,
      category: category,
    });

    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const addAllToCart = () => {
    appliedItems.forEach(([category, config]) => {
      addToCart(category, config);
    });

    toast({
      title: "All Items Added! 🛒",
      description: `${appliedItems.length} items have been added to your cart.`,
    });
  };

  if (appliedItems.length === 0) {
    return (
      <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20">
        <CardContent className="p-4 text-center">
          <Palette className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No makeup applied yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 animate-slideInLeft">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="h-4 w-4 text-fuchsia-500" />
            Applied Makeup
          </CardTitle>
          <Button
            size="sm"
            onClick={addAllToCart}
            className="h-6 text-xs bg-fuchsia-gradient hover:opacity-90 text-white"
          >
            <Plus className="h-3 w-3" />
            Add All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {appliedItems.map(([category, config]) => {
          const product =
            productMapping[category as keyof typeof productMapping];
          return (
            <div
              key={category}
              className="flex items-center justify-between p-2 rounded-lg bg-fuchsia-50/50 dark:bg-fuchsia-950/20 border border-fuchsia-200/30 dark:border-fuchsia-800/30"
            >
              <div className="flex items-start gap-2 flex-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: config.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{category}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(config.opacity * 100)}% opacity
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addToCart(category, config)}
                  className="h-6 w-6 p-0 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/20 hover:text-fuchsia-600"
                  title="Add to cart"
                >
                  <ShoppingCart className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMakeupItem(category)}
                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-950/20 hover:text-red-600"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
