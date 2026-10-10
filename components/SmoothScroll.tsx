"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { cancelFrame, frame } from "framer-motion";

let lenisInstance: Lenis | null = null;

// Native smooth scrolling fights Lenis, so route programmatic scrolls through it
export function smoothScrollTo(target: string | number | HTMLElement) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target);
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });
    lenisInstance = lenis;

    // Drive Lenis from framer-motion's frame loop so scroll position and
    // scroll-linked animations update in the same frame (no 1-frame lag).
    const update = ({ timestamp }: { timestamp: number }) => {
      lenis.raf(timestamp);
    };
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
