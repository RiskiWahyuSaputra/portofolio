"use client";

import { useCallback, useEffect, useRef } from "react";
import "./ClickSpark.css";

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children: React.ReactNode;
};

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

export default function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const isRunningRef = useRef(false);
  const animIdRef = useRef<number>(0);

  const easeFunc = useCallback((value: number) => {
    switch (easing) {
      case "linear":
        return value;
      case "ease-in":
        return value * value;
      case "ease-in-out":
        return value < 0.5 ? 2 * value * value : -1 + (4 - 2 * value) * value;
      default:
        return value * (2 - value);
    }
  }, [easing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  const startAnimation = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const draw = (timestamp: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(dpr, dpr);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = easeFunc(Math.max(0, elapsed / duration));
        const distance = progress * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - progress);
        const cos = Math.cos(spark.angle);
        const sin = Math.sin(spark.angle);
        const x1 = spark.x + distance * cos;
        const y1 = spark.y + distance * sin;
        const x2 = spark.x + (distance + lineLength) * cos;
        const y2 = spark.y + (distance + lineLength) * sin;

        context.strokeStyle = sparkColor;
        context.globalAlpha = 1 - progress;
        context.lineWidth = 2;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        return true;
      });

      context.restore();

      if (sparksRef.current.length > 0) {
        animIdRef.current = requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        isRunningRef.current = false;
        animIdRef.current = 0;
      }
    };

    animIdRef.current = requestAnimationFrame(draw);
  }, [duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    const count = Math.max(1, Math.floor(sparkCount));

    // event.clientX and event.clientY are relative to the viewport window
    sparksRef.current.push(
      ...Array.from({ length: count }, (_, index) => ({
        x: event.clientX,
        y: event.clientY,
        angle: (2 * Math.PI * index) / count,
        startTime: now,
      })),
    );

    startAnimation();
  };

  return (
    <div className="click-spark-root" onClick={handleClick}>
      <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />
      {children}
    </div>
  );
}