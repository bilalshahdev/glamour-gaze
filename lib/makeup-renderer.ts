import type { FaceLandmarks, MakeupConfig } from "@/types";

export class MakeupRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  drawMakeup(
    image: HTMLImageElement,
    landmarks: FaceLandmarks,
    config: MakeupConfig
  ): void {
    // Clear canvas and draw original image
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

    console.log("Drawing makeup with config:", config);
    console.log("Landmarks:", landmarks);

    // Apply makeup in order: hair, cheeks, eyes, eyebrows, lips
    if (config.hair) {
      console.log("Drawing hair makeup");
      this.drawHairMakeup(landmarks.face, config.hair);
    }

    if (config.cheeks) {
      console.log("Drawing cheek makeup");
      this.drawCheekMakeup(
        landmarks.leftCheek,
        landmarks.rightCheek,
        config.cheeks
      );
    }

    if (config.eyes) {
      console.log("Drawing eye makeup");
      this.drawEyeMakeup(landmarks.leftEye, landmarks.rightEye, config.eyes);
    }

    if (config.eyebrows) {
      console.log("Drawing eyebrow makeup");
      this.drawEyebrowMakeup(
        landmarks.leftEyebrow,
        landmarks.rightEyebrow,
        config.eyebrows
      );
    }

    if (config.lips) {
      console.log("Drawing lip makeup");
      this.drawLipMakeup(landmarks.lips, config.lips);
    }
  }

  private drawLipMakeup(lipPoints: number[][], config: any): void {
    if (!lipPoints || lipPoints.length === 0) return;

    this.ctx.save();
    this.ctx.globalCompositeOperation = config.blend_mode || "multiply";
    this.ctx.globalAlpha = config.opacity || 0.8;

    // Create a more comprehensive lip shape
    this.ctx.beginPath();

    if (lipPoints.length > 0) {
      // Start from the first point
      this.ctx.moveTo(lipPoints[0][0], lipPoints[0][1]);

      // Create smooth curves through all lip points
      for (let i = 1; i < lipPoints.length; i++) {
        const currentPoint = lipPoints[i];
        const nextPoint = lipPoints[(i + 1) % lipPoints.length];

        // Use quadratic curves for smoother lips
        const cpx = (currentPoint[0] + nextPoint[0]) / 2;
        const cpy = (currentPoint[1] + nextPoint[1]) / 2;

        this.ctx.quadraticCurveTo(currentPoint[0], currentPoint[1], cpx, cpy);
      }

      this.ctx.closePath();
      this.ctx.fillStyle = config.color;
      this.ctx.fill();

      // Add gloss effect if specified
      if (config.gloss) {
        this.ctx.globalCompositeOperation = "overlay";
        this.ctx.globalAlpha = 0.3;

        const centerX =
          lipPoints.reduce((sum, p) => sum + p[0], 0) / lipPoints.length;
        const centerY =
          lipPoints.reduce((sum, p) => sum + p[1], 0) / lipPoints.length;

        const gradient = this.ctx.createRadialGradient(
          centerX,
          centerY - 3,
          0,
          centerX,
          centerY - 3,
          20
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    }

    this.ctx.restore();
  }

  private drawEyeMakeup(
    leftEyePoints: number[][],
    rightEyePoints: number[][],
    config: any
  ): void {
    console.log("Drawing eye makeup with points:", {
      leftEyePoints,
      rightEyePoints,
      config,
    });

    if (
      !leftEyePoints ||
      !rightEyePoints ||
      leftEyePoints.length === 0 ||
      rightEyePoints.length === 0
    ) {
      console.log("No eye points available");
      return;
    }

    this.ctx.save();
    this.ctx.globalCompositeOperation = config.blend_mode || "multiply";
    this.ctx.globalAlpha = config.opacity || 0.6;

    // Process both eyes
    const eyeGroups = [leftEyePoints, rightEyePoints];

    eyeGroups.forEach((eyePoints, index) => {
      if (eyePoints.length === 0) return;

      const centerX =
        eyePoints.reduce((sum, p) => sum + p[0], 0) / eyePoints.length;
      const centerY =
        eyePoints.reduce((sum, p) => sum + p[1], 0) / eyePoints.length;

      console.log(`Eye ${index + 1} center:`, { centerX, centerY });

      // Create eyeshadow area (larger than eye for realistic effect)
      const gradient = this.ctx.createRadialGradient(
        centerX,
        centerY - 10,
        0,
        centerX,
        centerY - 10,
        40
      );
      gradient.addColorStop(0, config.color);
      gradient.addColorStop(0.4, this.adjustColorOpacity(config.color, 0.6));
      gradient.addColorStop(0.8, this.adjustColorOpacity(config.color, 0.2));
      gradient.addColorStop(1, "transparent");

      // Draw eyeshadow
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, centerY - 10, 40, 30, 0, 0, 2 * Math.PI);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Add shimmer effect if specified
      if (config.shimmer) {
        this.ctx.globalCompositeOperation = "overlay";
        this.ctx.globalAlpha = 0.4;

        const shimmerGradient = this.ctx.createRadialGradient(
          centerX,
          centerY - 8,
          0,
          centerX,
          centerY - 8,
          25
        );
        shimmerGradient.addColorStop(0, "rgba(255, 215, 0, 0.8)");
        shimmerGradient.addColorStop(0.6, "rgba(255, 215, 0, 0.3)");
        shimmerGradient.addColorStop(1, "transparent");

        this.ctx.fillStyle = shimmerGradient;
        this.ctx.fill();

        // Reset for next eye
        this.ctx.globalCompositeOperation = config.blend_mode || "multiply";
        this.ctx.globalAlpha = config.opacity || 0.6;
      }
    });

    this.ctx.restore();
  }

  private drawCheekMakeup(
    leftCheekPoints: number[][],
    rightCheekPoints: number[][],
    config: any
  ): void {
    console.log("Drawing cheek makeup with points:", {
      leftCheekPoints,
      rightCheekPoints,
      config,
    });

    if (
      !leftCheekPoints ||
      !rightCheekPoints ||
      leftCheekPoints.length === 0 ||
      rightCheekPoints.length === 0
    ) {
      console.log("No cheek points available");
      return;
    }

    this.ctx.save();
    this.ctx.globalCompositeOperation = config.blend_mode || "overlay";
    this.ctx.globalAlpha = config.opacity || 0.5;

    // Process both cheeks
    const cheekGroups = [leftCheekPoints, rightCheekPoints];

    cheekGroups.forEach((cheekPoints, index) => {
      if (cheekPoints.length === 0) return;

      const centerX =
        cheekPoints.reduce((sum, p) => sum + p[0], 0) / cheekPoints.length;
      const centerY =
        cheekPoints.reduce((sum, p) => sum + p[1], 0) / cheekPoints.length;

      console.log(`Cheek ${index + 1} center:`, { centerX, centerY });

      // Create soft circular blush with better blending
      const gradient = this.ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        50
      );
      gradient.addColorStop(0, config.color);
      gradient.addColorStop(0.3, this.adjustColorOpacity(config.color, 0.7));
      gradient.addColorStop(0.6, this.adjustColorOpacity(config.color, 0.4));
      gradient.addColorStop(0.9, this.adjustColorOpacity(config.color, 0.1));
      gradient.addColorStop(1, "transparent");

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });

    this.ctx.restore();
  }

  private drawEyebrowMakeup(
    leftBrowPoints: number[][],
    rightBrowPoints: number[][],
    config: any
  ): void {
    console.log("Drawing eyebrow makeup with points:", {
      leftBrowPoints,
      rightBrowPoints,
      config,
    });

    if (
      !leftBrowPoints ||
      !rightBrowPoints ||
      leftBrowPoints.length === 0 ||
      rightBrowPoints.length === 0
    ) {
      console.log("No eyebrow points available");
      return;
    }

    this.ctx.save();
    this.ctx.globalCompositeOperation = config.blend_mode || "multiply";
    this.ctx.globalAlpha = config.opacity || 0.8;

    // Process both eyebrows
    const browGroups = [leftBrowPoints, rightBrowPoints];

    browGroups.forEach((browPoints, index) => {
      if (browPoints.length === 0) return;

      console.log(
        `Drawing eyebrow ${index + 1} with ${browPoints.length} points`
      );

      // Draw eyebrow shape
      this.ctx.beginPath();
      this.ctx.moveTo(browPoints[0][0], browPoints[0][1]);

      for (let i = 1; i < browPoints.length; i++) {
        this.ctx.lineTo(browPoints[i][0], browPoints[i][1]);
      }

      this.ctx.strokeStyle = config.color;
      this.ctx.lineWidth = 4;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.stroke();

      // Add hair texture with individual strokes
      this.ctx.lineWidth = 1.5;
      const originalAlpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = originalAlpha * 0.8;

      for (let i = 0; i < browPoints.length - 1; i += 2) {
        const startX = browPoints[i][0];
        const startY = browPoints[i][1];

        // Create hair-like strokes
        for (let j = 0; j < 5; j++) {
          this.ctx.beginPath();
          this.ctx.moveTo(startX + (j - 2) * 2, startY - 3);
          this.ctx.lineTo(startX + (j - 2) * 2, startY + 3);
          this.ctx.stroke();
        }
      }

      // Reset alpha for next eyebrow
      this.ctx.globalAlpha = originalAlpha;
    });

    this.ctx.restore();
  }

  private drawHairMakeup(facePoints: number[][], config: any): void {
    if (!facePoints || facePoints.length === 0) return;

    this.ctx.save();
    this.ctx.globalCompositeOperation = config.blend_mode || "multiply";
    this.ctx.globalAlpha = config.opacity || 0.7;

    // Find the top of the head area
    const topY = Math.min(...facePoints.map((p) => p[1]));
    const leftX = Math.min(...facePoints.map((p) => p[0]));
    const rightX = Math.max(...facePoints.map((p) => p[0]));

    // Create hair region
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.canvas.width, 0);
    this.ctx.lineTo(this.canvas.width, topY + 100);

    // Create curved hairline
    const hairlinePoints = facePoints
      .filter((p) => p[1] < topY + 150)
      .sort((a, b) => a[0] - b[0]);

    if (hairlinePoints.length > 0) {
      for (let i = hairlinePoints.length - 1; i >= 0; i--) {
        this.ctx.lineTo(hairlinePoints[i][0], hairlinePoints[i][1] - 40);
      }
    }

    this.ctx.lineTo(0, topY + 100);
    this.ctx.closePath();

    // Apply base hair color
    this.ctx.fillStyle = config.color;
    this.ctx.fill();

    // Add hair texture
    this.ctx.globalAlpha = 0.3;
    const numStrands = 80;

    for (let i = 0; i < numStrands; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * (topY + 120);

      if (y < topY + 100) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + Math.random() * 20 - 10, y + Math.random() * 30);
        this.ctx.strokeStyle = this.adjustColorBrightness(
          config.color,
          Math.random() * 40 - 20
        );
        this.ctx.lineWidth = Math.random() * 1.5 + 0.5;
        this.ctx.stroke();
      }
    }

    this.ctx.restore();
  }

  private adjustColorBrightness(color: string, amount: number): string {
    const hex = color.replace("#", "");
    const r = Math.max(
      0,
      Math.min(255, Number.parseInt(hex.substr(0, 2), 16) + amount)
    );
    const g = Math.max(
      0,
      Math.min(255, Number.parseInt(hex.substr(2, 2), 16) + amount)
    );
    const b = Math.max(
      0,
      Math.min(255, Number.parseInt(hex.substr(4, 2), 16) + amount)
    );
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  private adjustColorOpacity(color: string, opacity: number): string {
    const hex = color.replace("#", "");
    const r = Number.parseInt(hex.substr(0, 2), 16);
    const g = Number.parseInt(hex.substr(2, 2), 16);
    const b = Number.parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
