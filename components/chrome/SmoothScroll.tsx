"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { ensurePointerTracking, prefersReducedMotion, setLenis } from "@/lib/runtime";

/** Inertial smooth scrolling (disabled for reduced-motion users). */
export function SmoothScroll() {
  useEffect(() => {
    ensurePointerTracking();
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    setLenis(lenis);
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
