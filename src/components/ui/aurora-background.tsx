"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

type AuroraVariant = "default" | "sunset" | "ocean" | "forest" | "lavender" | "ember" | "ice" | "custom";

interface AuroraBackgroundProps {
  className?: string;
  variant?: AuroraVariant;
  colors?: [string, string, string];
  speed?: number;
  blobCount?: number;
  children?: React.ReactNode;
  childrenClassName?: string;
}

const VARIANTS: Record<AuroraVariant, [string, string, string][]> = {
  custom: [],
  default: [
    ["hsla(260, 70%, 60%, 0.4)", "hsla(280, 60%, 50%, 0.2)", "transparent"],
    ["hsla(320, 80%, 70%, 0.3)", "transparent", "transparent"],
  ],
  ember: [
    ["hsla(25, 95%, 55%, 0.5)", "hsla(0, 90%, 50%, 0.3)", "transparent"],
    ["hsla(45, 90%, 60%, 0.4)", "transparent", "transparent"],
  ],
  forest: [
    ["hsla(145, 60%, 45%, 0.45)", "hsla(165, 55%, 40%, 0.25)", "transparent"],
    ["hsla(120, 65%, 50%, 0.35)", "transparent", "transparent"],
  ],
  ice: [
    ["hsla(200, 70%, 75%, 0.4)", "hsla(220, 60%, 85%, 0.25)", "transparent"],
    ["hsla(180, 65%, 80%, 0.35)", "transparent", "transparent"],
  ],
  lavender: [
    ["hsla(270, 70%, 65%, 0.45)", "hsla(300, 60%, 55%, 0.25)", "transparent"],
    ["hsla(240, 75%, 70%, 0.35)", "transparent", "transparent"],
  ],
  ocean: [
    ["hsla(195, 85%, 52%, 0.5)", "hsla(215, 75%, 48%, 0.3)", "transparent"],
    ["hsla(175, 80%, 55%, 0.35)", "hsla(205, 90%, 60%, 0.2)", "transparent"],
    ["hsla(225, 80%, 50%, 0.4)", "transparent", "transparent"],
  ],
  sunset: [
    ["hsla(15, 90%, 65%, 0.5)", "hsla(350, 80%, 55%, 0.3)", "transparent"],
    ["hsla(45, 95%, 60%, 0.4)", "transparent", "transparent"],
  ],
};

export function AuroraBackground({
  className,
  variant = "default",
  colors,
  speed = 0.92,
  blobCount = 5,
  children,
  childrenClassName,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  // Smooth normalized cursor state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, velocity: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette =
      variant === "custom" && colors
        ? [
            [colors[0], colors[1], colors[2]],
            [colors[0], "transparent", "transparent"],
          ]
        : VARIANTS[variant];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Continuous smooth normalized mouse tracking (-0.5 to 0.5) relative to viewport
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;

      const dx = normX - mouseRef.current.lastX;
      const dy = normY - mouseRef.current.lastY;
      const dist = Math.hypot(dx, dy);

      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
      mouseRef.current.velocity = Math.min(dist * 8, 1.2);

      mouseRef.current.lastX = normX;
      mouseRef.current.lastY = normY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let raf: number;
    const animate = () => {
      // Decay velocity boost smoothly
      mouseRef.current.velocity *= 0.92;
      const velocityBoost = mouseRef.current.velocity;

      // Smooth responsive lerp (0.08) for instant, fluid cursor parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const effectiveSpeed = (0.009 + velocityBoost * 0.01) * speed;
      timeRef.current += effectiveSpeed;

      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Noticeable, fluid parallax offset (moves along with cursor movement)
      const mx = mouseRef.current.x * (w * 0.35);
      const my = mouseRef.current.y * (h * 0.35);

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < blobCount; i++) {
        const layer = palette[i % palette.length];
        if (!layer) continue;
        const [c1, c2, c3] = layer;

        const phase = (i / blobCount) * Math.PI * 2 + t * 0.8;
        const radiusMult = 0.45 + Math.sin(t * 0.5 + i) * 0.05;

        // Base trajectory + interactive cursor parallax shift
        const layerDepth = 0.4 + (i % 3) * 0.25;
        const baseX = w / 2 + Math.sin(phase) * (w * 0.28) + Math.cos(t * 0.6 + i) * (w * 0.12);
        const baseY = h / 2 + Math.cos(phase * 0.8) * (h * 0.25) + Math.sin(t * 0.4 + i) * (h * 0.1);

        const x = baseX + mx * layerDepth;
        const y = baseY + my * layerDepth;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * radiusMult);
        gradient.addColorStop(0, c1 ?? "transparent");
        gradient.addColorStop(0.5, c2 ?? "transparent");
        gradient.addColorStop(1, c3 ?? "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < Math.min(3, palette.length); i++) {
        const layer = palette[i];
        if (!layer) continue;
        const phase = (i / 2) * Math.PI + t * 0.7;
        const x = w / 2 + Math.sin(phase * 1.1) * (w * 0.2) + mx * 0.6;
        const y = h / 2 + Math.cos(phase * 0.8) * (h * 0.2) + my * 0.6;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.4);
        gradient.addColorStop(0, layer[0] ?? "transparent");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [variant, colors, speed, blobCount]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 size-full pointer-events-none" />
      {children && <div className={cn("relative", childrenClassName)}>{children}</div>}
    </div>
  );
}

export default AuroraBackground;
