"use client";

import { useId, type ReactNode } from "react";
import { Cat, Climber, PALETTES, PeekerClip, Peeker, Sitter, Sleeper, Swatter } from "./CtaCats";

// Cats on the Stats numbers. Each cat lives in its own 1em × 1em SVG anchored
// inside the (inline) number span, so 128 SVG units = 1em at any breakpoint.
//
// Ink positions below are in em from the span's top-left, measured for the
// site font (Outfit, tabular digits): digit tops sit at 0.30em, the baseline
// at ~1.017em, and each digit advance is ~0.567em.

export type StatCatKind = "projects" | "skills" | "company" | "dedication";

const UNITS = 128;
const SCALE = 1.5;
const DIGIT_TOP = 0.3;
const BASELINE = 1.017;

function Anchor({ left, top, children }: { left: number; top: number; children: ReactNode }) {
  return (
    <svg
      className="ctacats stat-cats"
      viewBox={`0 0 ${UNITS} ${UNITS}`}
      aria-hidden
      style={{
        position: "absolute",
        left: `${left}em`,
        top: `${top}em`,
        width: "1em",
        height: "1em",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      {children}
    </svg>
  );
}

export function StatCats({ kind }: { kind: StatCatKind }) {
  const rawId = useId();
  const clipId = `stat-peek-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  switch (kind) {
    // "13+": russian blue clinging to the left side of the "1"
    case "projects":
      return (
        <Anchor left={0.09} top={DIGIT_TOP + 0.3}>
          <Cat x={0} y={0} delay={0} scale={SCALE} meowAt={[-18, -54]}>
            <Climber p={PALETTES.russianBlue} />
          </Cat>
        </Anchor>
      );
    // "20+": cream tabby asleep on top of the "0"
    case "skills":
      return (
        <Anchor left={0.9} top={DIGIT_TOP}>
          <Cat x={0} y={1} delay={0.15} scale={SCALE} meowAt={[-22, -42]}>
            <Sleeper p={PALETTES.cream} />
          </Cat>
        </Anchor>
      );
    // "1": tuxedo on its hind legs, swatting the "1"
    case "company":
      return (
        <Anchor left={0.53} top={BASELINE}>
          <Cat x={20 * SCALE} y={0} delay={0.3} scale={SCALE} meowAt={[-4, -86]}>
            <Swatter p={PALETTES.tuxedo} />
          </Cat>
        </Anchor>
      );
    // "100%": brown tabby peeking over the first "0", ginger sitting on the "%"
    case "dedication":
      return (
        <>
          <Anchor left={0.9} top={DIGIT_TOP}>
            <defs>
              <PeekerClip id={clipId} />
            </defs>
            <Cat x={0} y={1} delay={0.45} scale={SCALE} meowAt={[0, -46]} clip={`url(#${clipId})`}>
              <Peeker p={PALETTES.brownTabby} />
            </Cat>
          </Anchor>
          <Anchor left={2.12} top={DIGIT_TOP}>
            <Cat x={0} y={1} delay={0.6} scale={SCALE} meowAt={[0, -68]}>
              <Sitter p={PALETTES.tabby} />
            </Cat>
          </Anchor>
        </>
      );
  }
}
