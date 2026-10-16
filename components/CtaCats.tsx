"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { CharMetrics, StrokeTextLayout } from "./StrokeText";
import "./CtaCats.css";

// Six cats climbing over the CTA heading. Drawn as SVG inside StrokeText's own
// <svg>, positioned from each letter's ink bounds, so they stay glued to the
// right letters at any screen size and in both languages.

export type Palette = {
  body: string;
  stroke: string;
  line: string; // mouth / closed eyes
  earInner: string;
  eye: string;
  pupil?: string;
  belly?: string;
  stripe?: string;
  patch?: string; // calico patch
  patch2?: string;
  points?: string; // siamese ears / mask / paws / tail
  muzzle?: string; // lower-face colour (tuxedo); defaults to points
  paws?: string; // defaults to points, then body
};

const INK = "#0a0a0a";

export const PALETTES = {
  tabby: { body: "#F2A541", stroke: INK, line: "#3b2410", earInner: "#F9A8B8", eye: "#1b1b1b", belly: "#FCE3B8", stripe: "#C2701E" },
  black: { body: "#26262c", stroke: "#6b6b78", line: "#9a9aa8", earInner: "#4b4b55", eye: "#FACC15", pupil: "#111" },
  white: { body: "#F5F5F4", stroke: INK, line: "#3f3f46", earInner: "#FBCFE8", eye: "#60A5FA", pupil: "#0f172a" },
  gray: { body: "#9CA3AF", stroke: INK, line: "#1f2937", earInner: "#F9A8B8", eye: "#84CC16", pupil: "#111", stripe: "#6B7280", belly: "#E5E7EB" },
  calico: { body: "#FAFAF9", stroke: INK, line: "#3f3f46", earInner: "#FBCFE8", eye: "#1b1b1b", patch: "#E8933A", patch2: "#2b2b2b" },
  siamese: { body: "#F1E4CF", stroke: INK, line: "#2a1d17", earInner: "#C9A99A", eye: "#38BDF8", pupil: "#0f172a", points: "#5A3E33" },
  russianBlue: { body: "#7C8DA6", stroke: INK, line: "#1e293b", earInner: "#C4A1B4", eye: "#4ADE80", pupil: "#0f172a", belly: "#A3B1C6" },
  tuxedo: { body: "#1f1f24", stroke: "#6b6b78", line: "#3f3f46", earInner: "#4b4b55", eye: "#A3E635", pupil: "#111", belly: "#F5F5F4", muzzle: "#F5F5F4", paws: "#F5F5F4" },
  cream: { body: "#F6D7A7", stroke: INK, line: "#4a3212", earInner: "#F9A8B8", eye: "#B45309", pupil: "#1c1917", stripe: "#E0A961", belly: "#FFF1DC" },
  brownTabby: { body: "#8B6A4F", stroke: INK, line: "#1c140d", earInner: "#D6A4A4", eye: "#FBBF24", pupil: "#1c1917", stripe: "#4E3826", belly: "#C9AE92" },
} satisfies Record<string, Palette>;

const SW = 2.2; // outline width
const CAT_SCALE = 1.3; // cats are drawn at ~1/128 em units, then scaled up

// ---------- Building blocks ----------

function Limb({ d, color, stroke, width }: { d: string; color: string; stroke: string; width: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={stroke} strokeWidth={width + SW * 2} />
      <path d={d} stroke={color} strokeWidth={width} />
    </g>
  );
}

function Tail({ d, p, className = "cat-tail" }: { d: string; p: Palette; className?: string }) {
  return (
    <g className={className}>
      <Limb d={d} color={p.points ?? p.body} stroke={p.stroke} width={6} />
    </g>
  );
}

function Paw({ cx, cy, p, rx = 5, ry = 3.8 }: { cx: number; cy: number; p: Palette; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={p.paws ?? p.points ?? p.body} stroke={p.stroke} strokeWidth={SW} />;
}

function Head({ p, closed = false }: { p: Palette; closed?: boolean }) {
  const ear = p.points ?? p.body;
  return (
    <g>
      <path d="M-17 -4 L-15 -25 L-3 -13 Z" fill={ear} stroke={p.stroke} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M17 -4 L15 -25 L3 -13 Z" fill={p.patch2 ?? ear} stroke={p.stroke} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-14 -8 L-13.5 -19 L-7 -12 Z" fill={p.earInner} />
      <path d="M14 -8 L13.5 -19 L7 -12 Z" fill={p.earInner} />
      <ellipse rx={19} ry={16} fill={p.body} stroke={p.stroke} strokeWidth={SW} />
      {p.patch && <path d="M-16.5 -3 C-17 -10 -10 -14.5 -3 -14.5 C-5 -8 -10 -3.5 -16.5 -3 Z" fill={p.patch} />}
      {p.patch2 && <path d="M15.5 -6 C14 -11 9 -14 4 -14.5 C5 -10 9 -6.5 15.5 -6 Z" fill={p.patch2} />}
      {p.stripe && (
        <g stroke={p.stripe} strokeWidth={2.2} strokeLinecap="round">
          <path d="M0 -15 v5" />
          <path d="M-5.5 -14 l1.2 4" />
          <path d="M5.5 -14 l-1.2 4" />
        </g>
      )}
      {(p.muzzle ?? p.points) && <ellipse cy={5} rx={10.5} ry={8.5} fill={p.muzzle ?? p.points} opacity={0.9} />}
      {closed ? (
        <g fill="none" stroke={p.line} strokeWidth={1.8} strokeLinecap="round">
          <path d="M-10 0 q3 3 6 0" />
          <path d="M4 0 q3 3 6 0" />
        </g>
      ) : (
        <g className="cat-blink">
          <ellipse cx={-7} cy={-1} rx={3.2} ry={4.2} fill={p.eye} />
          <ellipse cx={7} cy={-1} rx={3.2} ry={4.2} fill={p.eye} />
          {p.pupil && (
            <>
              <ellipse cx={-7} cy={-1} rx={1.2} ry={3.2} fill={p.pupil} />
              <ellipse cx={7} cy={-1} rx={1.2} ry={3.2} fill={p.pupil} />
            </>
          )}
          <circle cx={-6} cy={-2.6} r={1.1} fill="#fff" />
          <circle cx={8} cy={-2.6} r={1.1} fill="#fff" />
        </g>
      )}
      <path d="M-2.4 4 h4.8 l-2.4 2.8 z" fill="#F472B6" />
      <path d="M0 6.8 q-2 2.6 -4.6 1.2 M0 6.8 q2 2.6 4.6 1.2" fill="none" stroke={p.line} strokeWidth={1.2} strokeLinecap="round" />
      <g stroke={p.line} strokeWidth={0.9} opacity={0.55} strokeLinecap="round">
        <path d="M-10 5 L-25 3" />
        <path d="M-10 7.5 L-25 9" />
        <path d="M10 5 L25 3" />
        <path d="M10 7.5 L25 9" />
      </g>
    </g>
  );
}

function BodyStripes({ p, d }: { p: Palette; d: string }) {
  if (!p.stripe) return null;
  return <path d={d} fill="none" stroke={p.stripe} strokeWidth={2.4} strokeLinecap="round" />;
}

// Wrapper: positioning (SVG attr) > entrance (CSS) > hover hop (CSS) > pose.
export function Cat({
  x,
  y,
  delay,
  meowAt,
  children,
  clip,
  scale = CAT_SCALE,
}: {
  x: number;
  y: number;
  delay: number;
  meowAt: [number, number];
  children: ReactNode;
  clip?: string;
  scale?: number;
}) {
  return (
    <g className="cat" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})`} clipPath={clip}>
      <g className="cat-enter" style={{ "--d": `${delay}s` } as CSSProperties}>
        <g className="cat-hop">{children}</g>
        <text className="cat-meow" x={meowAt[0]} y={meowAt[1]} textAnchor="middle">
          meow!
        </text>
      </g>
    </g>
  );
}

// ---------- Poses (local origin documented per pose) ----------

/** Clinging to the left edge of a letter. Origin: letter's left ink edge. */
export function Climber({ p }: { p: Palette }) {
  return (
    <g className="cat-climb">
      <Tail p={p} d="M-18 24 C-34 30 -34 48 -22 56" />
      <ellipse cx={-14} cy={6} rx={12} ry={21} fill={p.body} stroke={p.stroke} strokeWidth={SW} />
      <BodyStripes p={p} d="M-25 -2 q5 3 10 1 M-26 8 q6 3 11 1 M-25 18 q5 3 10 1" />
      <Paw cx={-3} cy={25} p={p} rx={6} ry={4} />
      <Paw cx={-1} cy={-14} p={p} />
      <Paw cx={-2} cy={-1} p={p} />
      <g transform="translate(-17 -24) rotate(-6)">
        <Head p={p} />
      </g>
    </g>
  );
}

/** Sitting on top of a letter, tail dangling. Origin: letter top, centred. */
export function Sitter({ p }: { p: Palette }) {
  return (
    <g>
      <Tail p={p} d="M9 -4 C24 -2 27 16 21 34" />
      <path d="M-13 0 C-17 -14 -11 -26 0 -27 C11 -26 17 -14 13 0 Z" fill={p.body} stroke={p.stroke} strokeWidth={SW} />
      {p.belly && <ellipse cx={0} cy={-10} rx={6.5} ry={8} fill={p.belly} />}
      <Paw cx={-5.5} cy={-1.5} p={p} rx={4.5} ry={3} />
      <Paw cx={5.5} cy={-1.5} p={p} rx={4.5} ry={3} />
      <g transform="translate(0 -38)">
        <g className="cat-tilt">
          <Head p={p} />
        </g>
      </g>
    </g>
  );
}

/** Peeking over the top of a letter. Origin: letter top, centred. */
export function Peeker({ p }: { p: Palette }) {
  return (
    <g className="cat-peek">
      <g transform="translate(0 -13)">
        <Head p={p} />
      </g>
      <Paw cx={-12} cy={0} p={p} />
      <Paw cx={12} cy={0} p={p} />
    </g>
  );
}

/** Hanging from the bottom of a letter. Origin: letter baseline, centred. */
export function Hanger({ p }: { p: Palette }) {
  return (
    <g className="cat-swing">
      <Tail p={p} d="M8 60 C24 68 26 84 16 92" />
      <ellipse cx={0} cy={52} rx={13} ry={17} fill={p.body} stroke={p.stroke} strokeWidth={SW} />
      <Paw cx={-6} cy={68} p={p} rx={4.5} ry={6} />
      <Paw cx={6} cy={68} p={p} rx={4.5} ry={6} />
      <Limb d="M-9 36 L-9 2" color={p.body} stroke={p.stroke} width={7} />
      <Limb d="M9 36 L9 2" color={p.body} stroke={p.stroke} width={7} />
      <g transform="translate(0 31)">
        <Head p={p} />
      </g>
      <Paw cx={-9} cy={0} p={p} rx={5.5} ry={4} />
      <Paw cx={9} cy={0} p={p} rx={5.5} ry={4} />
    </g>
  );
}

/** Curled up asleep on top of a letter. Origin: letter top, centred. */
export function Sleeper({ p }: { p: Palette }) {
  return (
    <g>
      <g className="cat-breathe">
        <ellipse cx={4} cy={-12} rx={25} ry={12.5} fill={p.body} stroke={p.stroke} strokeWidth={SW} />
        {p.patch && <path d="M10 -23 C20 -23 27 -17 28 -10 C20 -12 14 -16 10 -23 Z" fill={p.patch} />}
        {p.patch2 && <path d="M-4 -24 C2 -25 7 -23 9 -20 C3 -18 -1 -20 -4 -24 Z" fill={p.patch2} />}
        <Limb d="M27 -6 C20 2 -6 3 -16 -1" color={p.body} stroke={p.stroke} width={6} />
        <g transform="translate(-19 -15) rotate(-12) scale(0.92)">
          <Head p={p} closed />
        </g>
      </g>
      <g className="cat-zzz" fill="#C4B5FD">
        <text x={-6} y={-38} fontSize={13}>z</text>
        <text x={2} y={-50} fontSize={10}>z</text>
        <text x={9} y={-60} fontSize={8}>z</text>
      </g>
    </g>
  );
}

/** On its hind legs beside a letter, swatting at it. Origin: baseline, right of the letter. */
export function Swatter({ p }: { p: Palette }) {
  return (
    <g>
      <Tail p={p} d="M9 -8 C26 -14 30 -32 22 -46" />
      <ellipse cx={0} cy={-24} rx={12} ry={19} transform="rotate(-12 0 -24)" fill={p.body} stroke={p.stroke} strokeWidth={SW} />
      <Paw cx={-6} cy={-2} p={p} rx={6} ry={3.5} />
      <Paw cx={7} cy={-2} p={p} rx={6} ry={3.5} />
      <Paw cx={-5} cy={-22} p={p} rx={4} ry={3.5} />
      <g className="cat-swat">
        <Limb d="M-5 -34 L-20 -48" color={p.points ?? p.body} stroke={p.stroke} width={6.5} />
        <Paw cx={-21} cy={-49} p={p} rx={4.5} ry={4} />
      </g>
      <g transform="translate(-6 -52) rotate(-10)">
        <Head p={p} />
      </g>
    </g>
  );
}

// ---------- Placement ----------

const isLetter = (c: CharMetrics) => /\p{L}/u.test(c.char);
const inkWidth = (c: CharMetrics) => c.inkRight - c.inkLeft;
const centre = (c: CharMetrics) => (c.inkLeft + c.inkRight) / 2;

function splitWords(chars: CharMetrics[]) {
  const words: CharMetrics[][] = [];
  let current: CharMetrics[] = [];
  for (const c of chars) {
    if (/\s/.test(c.char)) {
      if (current.length) words.push(current);
      current = [];
    } else {
      current.push(c);
    }
  }
  if (current.length) words.push(current);
  return words;
}

function pick(
  candidates: CharMetrics[],
  used: Set<number>,
  score: (c: CharMetrics) => number,
  filter: (c: CharMetrics) => boolean = () => true,
) {
  let best: CharMetrics | undefined;
  for (const c of candidates) {
    if (!isLetter(c) || used.has(c.index) || !filter(c)) continue;
    if (!best || score(c) > score(best)) best = c;
  }
  if (best) used.add(best.index);
  return best;
}

export function PeekerClip({ id }: { id: string }) {
  // Only the part above the letter's top edge shows, so the head can sink
  // "behind" the letter without showing through its counters.
  return (
    <clipPath id={id} clipPathUnits="userSpaceOnUse">
      <rect x={-60} y={-140} width={120} height={143} />
    </clipPath>
  );
}

export function CtaCats({ layout }: { layout: StrokeTextLayout }) {
  const rawId = useId();
  const clipId = `cat-peek-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const em = layout.fontSize;
  const words = splitWords(layout.chars);
  if (words.length === 0) return null;

  const first = words[0];
  const middle = words[Math.min(1, words.length - 1)];
  const last = words[words.length - 1];
  const used = new Set<number>();
  const xHeight = em * 0.6; // anything shorter than this has a flat-ish top

  const climbOn = first.find(isLetter);
  if (climbOn) used.add(climbOn.index);
  const lastLetter = [...last].reverse().find(isLetter);
  if (lastLetter) used.add(lastLetter.index);
  // Tallest letter of the first word (skip i/j: they'd sit on the dot)
  const sitOn = pick(first, used, (c) => -c.inkTop, (c) => !/[ij]/i.test(c.char));
  // Hang from a letter without a descender, as far right in the middle word as possible
  const hangFrom = pick(middle, used, (c) => c.index, (c) => c.inkBottom < em * 0.05);
  const peekOver = pick(middle, used, inkWidth, (c) => -c.inkTop < xHeight);
  const sleepOn = pick(last, used, inkWidth, (c) => -c.inkTop < xHeight);

  return (
    <g className="ctacats" aria-hidden>
      <defs>{peekOver && <PeekerClip id={clipId} />}</defs>
      {climbOn && (
        <Cat x={climbOn.inkLeft + 1} y={climbOn.inkTop + (climbOn.inkBottom - climbOn.inkTop) * 0.42} delay={0} meowAt={[-18, -54]}>
          <Climber p={PALETTES.tabby} />
        </Cat>
      )}
      {sitOn && (
        <Cat x={centre(sitOn)} y={sitOn.inkTop + 1} delay={0.15} meowAt={[0, -68]}>
          <Sitter p={PALETTES.black} />
        </Cat>
      )}
      {peekOver && (
        <Cat x={centre(peekOver)} y={peekOver.inkTop + 1} delay={0.3} meowAt={[0, -46]} clip={`url(#${clipId})`}>
          <Peeker p={PALETTES.gray} />
        </Cat>
      )}
      {hangFrom && (
        <Cat x={centre(hangFrom)} y={hangFrom.inkBottom - 1} delay={0.45} meowAt={[30, 30]}>
          <Hanger p={PALETTES.white} />
        </Cat>
      )}
      {sleepOn && (
        <Cat x={centre(sleepOn)} y={sleepOn.inkTop + 1} delay={0.6} meowAt={[-22, -42]}>
          <Sleeper p={PALETTES.calico} />
        </Cat>
      )}
      {lastLetter && (
        <Cat x={lastLetter.inkRight + 20 * CAT_SCALE} y={0} delay={0.75} meowAt={[-4, -86]}>
          <Swatter p={PALETTES.siamese} />
        </Cat>
      )}
    </g>
  );
}
