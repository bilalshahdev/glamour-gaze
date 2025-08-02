"use client";
import { Card, CardContent } from "@/components/ui/card";
import { featuredProducts } from "@/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  return (
    <div className="mb-16 animate-fadeInUp">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Featured Products
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover our premium makeup collection
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {featuredProducts.map((product, index) => (
          <Card
            key={product.name}
            className="glass border-fuchsia-200/20 dark:border-fuchsia-800/20 shadow-lg hover-lift animate-fadeInUp bg-white/80 dark:bg-gray-800/80"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            <CardContent className="p-6 text-center">
              <div
                className="w-16 h-16 rounded-full border-2 border-white shadow-lg mx-auto mb-4"
                style={{ backgroundColor: product.color }}
              />
              <h3 className="font-semibold text-foreground mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {product.category}
              </p>
              <p className="text-lg font-bold text-foreground">
                {product.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link href="/products">
          <Button className="bg-fuchsia-gradient hover:opacity-90 text-white hover-lift">
            View All Products
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;
