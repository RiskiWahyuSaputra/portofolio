"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./DriftWall.css";

type DriftItem = { image: string; title?: string; href?: string; credentialUrl?: string };

type DriftWallProps = {
  items: DriftItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  onItemClick?: (item: DriftItem) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const columnFactor = (index: number, variance: number) => 1 + variance * ((((index * 0.6180339887 + 0.35) % 1) * 2) - 1);

export default function DriftWall({
  items,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = "#060010",
  onItemClick,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<(HTMLDivElement | null)[]>([]);
  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dampedRef = useRef({ x: 0, y: 0 });
  const hoveredColumnRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);
  const [height, setHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const columnItems = useMemo(() => {
    const result = Array.from({ length: columns }, () => [] as DriftItem[]);
    items.forEach((item, index) => result[index % columns].push(item));
    return result.map((column) => (column.length ? column : items.slice(0, 1)));
  }, [columns, items]);

  const columnMeta = useMemo(() => columnItems.map((column) => {
    const copyHeight = Math.max(tileHeight + gap, column.length * (tileHeight + gap));
    return { copyHeight, copies: Math.max(2, Math.ceil((height * 1.6) / copyHeight) + 1) };
  }), [columnItems, gap, height, tileHeight]);

  const velocities = useMemo(() => {
    const sign = direction === "up" ? 1 : -1;
    return columnItems.map((_, index) => speed * columnFactor(index, variance) * sign * (index % 2 === 0 ? 1 : -1));
  }, [columnItems, direction, speed, variance]);

  const transformPlane = useCallback((px: number, py: number) => {
    if (!planeRef.current) return;
    planeRef.current.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${tilt + py}deg) rotateY(${turn + px}deg) translateZ(${-depth}px)`;
  }, [depth, tilt, turn]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const resize = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height || 600));
    resize.observe(root);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener("change", change);

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: "200px" });
    observer.observe(root);

    return () => {
      resize.disconnect();
      media.removeEventListener("change", change);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, index) => meta.copyHeight * ((index * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnItems, columnMeta]);

  useEffect(() => {
    if (!isVisible) return;
    let frame = 0;
    const animate = (time: number) => {
      const last = lastTimeRef.current ?? time;
      const delta = Math.min(0.05, Math.max(0, time - last) / 1000);
      lastTimeRef.current = time;
      const maxTilt = parallax * 8;
      const damping = 1 - Math.exp(-delta / 0.12);
      dampedRef.current.x += (pointerRef.current.x * maxTilt - dampedRef.current.x) * damping;
      dampedRef.current.y += (-pointerRef.current.y * maxTilt - dampedRef.current.y) * damping;
      transformPlane(dampedRef.current.x, dampedRef.current.y);

      tracksRef.current.forEach((track, index) => {
        const meta = columnMeta[index];
        if (!track || !meta) return;
        const paused = (wallHoveredRef.current && pauseOnHover) || hoveredColumnRef.current === index;
        const target = reduced || paused ? 0 : velocities[index];
        const ease = 1 - Math.exp(-delta / (target === 0 ? 0.16 : 0.28));
        velocitiesRef.current[index] += (target - velocitiesRef.current[index]) * ease;
        offsetsRef.current[index] = ((offsetsRef.current[index] + velocitiesRef.current[index] * delta) % meta.copyHeight + meta.copyHeight) % meta.copyHeight;
        track.style.transform = `translate3d(0, ${-offsetsRef.current[index]}px, 0)`;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); lastTimeRef.current = null; };
  }, [columnMeta, isVisible, pauseOnHover, parallax, reduced, transformPlane, velocities]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
    const tile = (event.target as HTMLElement).closest<HTMLElement>("[data-tile-id]");
    if (tile) {
      setActiveId(tile.dataset.tileId ?? null);
      hoveredColumnRef.current = Number(tile.dataset.column);
    }
  };

  const cssVars = {
    "--dw-tile-w": `${tileWidth}px`, "--dw-tile-h": `${tileHeight}px`, "--dw-gap": `${gap}px`,
    "--dw-radius": `${radius}px`, "--dw-perspective": `${perspective}px`, "--dw-lift": `${lift}px`,
    "--dw-dim": dim, "--dw-gray": grayscale ? 1 : 0, "--dw-overlay": overlayColor,
    "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`,
  } as React.CSSProperties;

  return (
    <div ref={containerRef} className={`drift-wall${reduced ? " drift-wall--reduced" : ""}`} style={cssVars} onPointerMove={handlePointerMove} onPointerEnter={() => { wallHoveredRef.current = true; }} onPointerLeave={() => { wallHoveredRef.current = false; pointerRef.current = { x: 0, y: 0 }; hoveredColumnRef.current = -1; setActiveId(null); }} role="group" aria-label="Drifting certificate wall">
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((column, columnIndex) => {
          const meta = columnMeta[columnIndex];
          return <div className="drift-wall__column" key={columnIndex}>
            <div className="drift-wall__track" ref={(node) => { tracksRef.current[columnIndex] = node; }}>
              {Array.from({ length: meta.copies }).flatMap((_, copyIndex) => column.map((item, itemIndex) => {
                const id = `${columnIndex}-${copyIndex}-${itemIndex}`;
                const tile = <span className={`drift-wall__inner${activeId === id ? " is-active" : ""}`}><img src={item.image} alt={item.title ?? ""} loading="lazy" decoding="async" draggable={false} /><span className="drift-wall__overlay" /></span>;
                return item.href ? <a className="drift-wall__tile" key={id} data-tile-id={id} data-column={columnIndex} href={item.href} target="_blank" rel="noreferrer noopener">{tile}</a> : <div className="drift-wall__tile" key={id} data-tile-id={id} data-column={columnIndex} tabIndex={0} role="button" aria-label={item.title} onClick={() => onItemClick?.(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onItemClick?.(item); }}>{tile}</div>;
              }))}
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}
