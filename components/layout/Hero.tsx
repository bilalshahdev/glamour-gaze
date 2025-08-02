"use client";

import { Download, Upload, Wand2 } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero-section bg-fuchsia-gradient dark:bg-fuchsia-gradient-dark text-white py-12 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInLeft">
          Transform Your Look
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 animate-slideInRight">
          AI-powered virtual makeup try-on experience
        </p>
        <div
          className="flex flex-wrap justify-center gap-8 text-sm animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <span>Upload Photo</span>
          </div>
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            <span>Apply Makeup</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <span>Download Result</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
