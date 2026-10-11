"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { Hud, SectionRail } from "./Hud";
import { SmoothScroll } from "./SmoothScroll";

const NeuralField = dynamic(() => import("../three/NeuralField"), { ssr: false });

/** Global client chrome: background field, navigation, palette, smooth scroll. */
export function Shell({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere__glow atmosphere__glow--a" />
        <div className="atmosphere__glow atmosphere__glow--b" />
      </div>
      <NeuralField />
      <div className="grain" aria-hidden="true" />
      <Hud onOpenPalette={() => setPalette(true)} />
      <SectionRail />
      {children}
      <CommandPalette open={palette} setOpen={setPalette} />
    </MotionConfig>
  );
}
