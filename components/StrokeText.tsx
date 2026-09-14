"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./StrokeText.css";

type StrokeTextProps = {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  className?: string;
  active?: boolean;
};

export default function StrokeText({
  text,
  strokeColor = "#A78BFA",
  fillColor = "#F8FAFC",
  strokeWidth = 1.4,
  drawDuration = 1.2,
  fillDelay = 0.15,
  stagger = 0.04,
  ease = "power2.out",
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = -4,
  className = "",
  active = false,
}: StrokeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const wipeRef = useRef<SVGRectElement>(null);
  const [box, setBox] = useState<DOMRect | null>(null);
  const rawId = useId();
  const clipId = `stroke-text-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const characters = useMemo(() => Array.from(text), [text]);
  const fontStyle = { fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` };

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) return;
    const measure = () => {
      const bbox = node.getBBox();
      if (bbox.width) setBox(bbox);
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
  }, [fontSize, fontWeight, letterSpacing, text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !box) return;
    const strokes = Array.from(root.querySelectorAll<SVGTextElement>("[data-stroke-char]"));
    const fills = Array.from(root.querySelectorAll<SVGTextElement>("[data-fill-char]"));
    const wipe = wipeRef.current;
    const dash = Math.max(fontSize * 7, 200);
    const targets = [...strokes, ...fills, ...(wipe ? [wipe] : [])];
    const timeline = gsap.timeline({ paused: true });

    gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
    gsap.set(fills, { opacity: 1 });
    if (wipe) gsap.set(wipe, { attr: { width: 0 } });

    timeline.to(strokes, {
      strokeDashoffset: 0,
      duration: drawDuration,
      ease,
      stagger,
    });
    if (wipe) {
      timeline.to(wipe, { attr: { width: box.width + Math.abs(box.x) }, duration: 0.6, ease: "power2.inOut" }, `+=${fillDelay}`);
    }

    if (active) timeline.play(0);

    return () => {
      timeline.kill();
      gsap.killTweensOf(targets);
    };
  }, [active, box, drawDuration, ease, fillDelay, fontSize, stagger]);

  const viewBox = box ? `${box.x - 8} ${box.y - 8} ${box.width + 16} ${box.height + 16}` : `0 ${-fontSize} 600 ${fontSize * 1.3}`;

  return (
    <span ref={rootRef} className={`stroke-text ${className}`.trim()} role="img" aria-label={text}>
      <svg className="stroke-text__svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {box && (
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <rect ref={wipeRef} x={box.x - 8} y={box.y - 8} width="0" height={box.height + 16} />
            </clipPath>
          </defs>
        )}
        <text ref={textRef} className="stroke-text__stroke" x="0" y="0" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" style={fontStyle}>
          {characters.map((char, index) => <tspan data-stroke-char key={`stroke-${index}`}>{char}</tspan>)}
        </text>
        <text className="stroke-text__fill" x="0" y="0" fill={fillColor} stroke="none" style={fontStyle} clipPath={`url(#${clipId})`}>
          {characters.map((char, index) => <tspan data-fill-char key={`fill-${index}`}>{char}</tspan>)}
        </text>
      </svg>
    </span>
  );
}
