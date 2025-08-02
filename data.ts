import { Heart, Eye, Palette, Brush, Scissors } from "lucide-react";

export const productCategories = [
  { id: "lips", name: "Lips", icon: Heart, color: "text-fuchsia-600" },
  { id: "eyes", name: "Eyes", icon: Eye, color: "text-purple-600" },
  { id: "cheeks", name: "Cheeks", icon: Palette, color: "text-pink-600" },
  { id: "eyebrows", name: "Brows", icon: Brush, color: "text-fuchsia-700" },
  { id: "hair", name: "Hair", icon: Scissors, color: "text-purple-700" },
];

// Enhanced product data with better presentation
export const products = {
  lips: [
    {
      id: 1,
      name: "Velvet Matte Lipstick",
      brand: "Glamour Gaze Pro",
      price: "$24.99",
      originalPrice: "$32.99",
      color: "#DC143C",
      rating: 4.8,
      reviews: 1247,
      description:
        "Long-lasting matte finish with intense color payoff. Enriched with vitamin E.",
      features: ["16-hour wear", "Transfer-proof", "Vitamin E enriched"],
      bestseller: true,
    },
    {
      id: 2,
      name: "Glossy Lip Tint",
      brand: "Glamour Gaze",
      price: "$19.99",
      color: "#FF69B4",
      rating: 4.6,
      reviews: 892,
      description:
        "Natural-looking tint with high-shine finish that lasts all day.",
      features: ["All-day wear", "Moisturizing", "Natural finish"],
    },
    {
      id: 3,
      name: "Liquid Lipstick Set",
      brand: "Glamour Gaze Pro",
      price: "$45.99",
      originalPrice: "$59.99",
      color: "#8B0000",
      rating: 4.9,
      reviews: 1456,
      description:
        "Set of 6 rich, velvety liquid lipsticks with full coverage.",
      features: ["6 shades included", "Velvety texture", "Full coverage"],
      newArrival: true,
    },
    {
      id: 4,
      name: "Plumping Lip Gloss",
      brand: "Glamour Gaze",
      price: "$22.99",
      color: "#FF7F50",
      rating: 4.5,
      reviews: 634,
      description:
        "High-shine gloss with plumping effect and moisturizing formula.",
      features: ["Plumping effect", "High shine", "Moisturizing"],
    },
  ],
  eyes: [
    {
      id: 5,
      name: "Smoky Eye Palette",
      brand: "Glamour Gaze Pro",
      price: "$45.99",
      originalPrice: "$55.99",
      color: "#696969",
      rating: 4.9,
      reviews: 2134,
      description:
        "12-shade palette with smoky grays and shimmers for dramatic looks.",
      features: ["12 shades", "Highly pigmented", "Blendable formula"],
      bestseller: true,
    },
    {
      id: 6,
      name: "Golden Hour Eyeshadow",
      brand: "Glamour Gaze",
      price: "$28.99",
      color: "#FFD700",
      rating: 4.7,
      reviews: 1089,
      description: "Shimmery golden eyeshadow with smooth, buildable coverage.",
      features: ["Shimmer finish", "Buildable", "Long-wearing"],
    },
    {
      id: 7,
      name: "Purple Dreams Palette",
      brand: "Glamour Gaze Pro",
      price: "$42.99",
      color: "#9370DB",
      rating: 4.8,
      reviews: 756,
      description: "8-shade purple palette from light lavender to deep plum.",
      features: ["8 purple shades", "Matte & shimmer", "Crease-resistant"],
      newArrival: true,
    },
    {
      id: 8,
      name: "Bronze Goddess Stick",
      brand: "Glamour Gaze",
      price: "$26.99",
      color: "#CD7F32",
      rating: 4.6,
      reviews: 943,
      description:
        "Convenient stick format for easy bronze eyeshadow application.",
      features: ["Stick format", "Easy application", "Creamy texture"],
    },
  ],
  cheeks: [
    {
      id: 9,
      name: "Peachy Keen Blush",
      brand: "Glamour Gaze Pro",
      price: "$29.99",
      color: "#FFCBA4",
      rating: 4.8,
      reviews: 1234,
      description:
        "Natural peachy glow with buildable coverage and silky texture.",
      features: ["Buildable coverage", "Silky texture", "Natural glow"],
      bestseller: true,
    },
    {
      id: 10,
      name: "Rose Petal Powder",
      brand: "Glamour Gaze",
      price: "$34.99",
      color: "#FF91A4",
      rating: 4.7,
      reviews: 1567,
      description:
        "Finely milled powder blush for a soft, natural flush of color.",
      features: ["Finely milled", "Natural finish", "Long-lasting"],
    },
    {
      id: 11,
      name: "Coral Cream Blush",
      brand: "Glamour Gaze",
      price: "$27.99",
      color: "#FF6B6B",
      rating: 4.6,
      reviews: 892,
      description:
        "Cream formula that melts into skin for a natural, dewy finish.",
      features: ["Cream formula", "Dewy finish", "Blendable"],
    },
  ],
  eyebrows: [
    {
      id: 12,
      name: "Precision Brow Pencil",
      brand: "Glamour Gaze Pro",
      price: "$18.99",
      color: "#8B4513",
      rating: 4.7,
      reviews: 1023,
      description:
        "Ultra-fine tip for precise, hair-like strokes that look natural.",
      features: ["Ultra-fine tip", "Natural finish", "Long-wearing"],
      bestseller: true,
    },
    {
      id: 13,
      name: "Brow Gel & Pencil Duo",
      brand: "Glamour Gaze",
      price: "$32.99",
      originalPrice: "$39.99",
      color: "#654321",
      rating: 4.8,
      reviews: 678,
      description: "Complete brow kit with defining pencil and setting gel.",
      features: ["2-in-1 kit", "Defining pencil", "Setting gel"],
    },
  ],
  hair: [
    {
      id: 14,
      name: "Temporary Hair Color Kit",
      brand: "Glamour Gaze Pro",
      price: "$39.99",
      color: "#3C2415",
      rating: 4.5,
      reviews: 456,
      description:
        "Easy-to-use temporary hair color that washes out completely.",
      features: ["Temporary", "Easy application", "Washes out"],
    },
    {
      id: 15,
      name: "Hair Chalk Set",
      brand: "Glamour Gaze",
      price: "$24.99",
      color: "#DAA520",
      rating: 4.3,
      reviews: 789,
      description:
        "Set of 6 vibrant hair chalks for temporary color highlights.",
      features: ["6 colors", "Temporary", "Easy to use"],
      newArrival: true,
    },
  ],
};

export const featuredProducts = [
  {
    name: "Velvet Matte Lipstick",
    price: "$24.99",
    color: "#DC143C",
    category: "Lips",
  },
  {
    name: "Golden Hour Eyeshadow",
    price: "$28.99",
    color: "#FFD700",
    category: "Eyes",
  },
  {
    name: "Peachy Keen Blush",
    price: "$29.99",
    color: "#FFCBA4",
    category: "Cheeks",
  },
];

export const steps = [
  {
    title: "Upload Your Photo",
    description: "Choose a clear, front-facing photo with good lighting",
    delay: "0.1s",
  },
  {
    title: "AI Face Detection",
    description:
      "Our AI detects 468 facial landmarks for precise makeup application",
    delay: "0.2s",
  },
  {
    title: "Try Different Looks",
    description: "Experiment with lipstick, eyeshadow, blush, and more",
    delay: "0.3s",
  },
];
