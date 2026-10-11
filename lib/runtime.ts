"use client";

import type Lenis from "lenis";

/**
 * Mutable, render-free stores shared between DOM and WebGL layers.
 * Read inside animation loops; never trigger React renders.
 */

/** Pointer in normalised device coords (-1..1), updated from window events so it works over any element. */
export const pointer = { x: 0, y: 0, px: -9999, py: -9999, active: false, lastMove: 0 };

/** Page scroll in px and 0..1 progress. */
export const scroll = { y: 0, progress: 0, velocity: 0 };

let listening = false;

export function ensurePointerTracking() {
  if (listening || typeof window === "undefined") return;
  listening = true;

  const update = (clientX: number, clientY: number) => {
    pointer.px = clientX;
    pointer.py = clientY;
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(clientY / window.innerHeight) * 2 + 1;
    pointer.active = true;
    pointer.lastMove = performance.now();
  };

  window.addEventListener("pointermove", (e) => update(e.clientX, e.clientY), { passive: true });
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => (pointer.active = false));

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    scroll.velocity = y - scroll.y;
    scroll.y = y;
    scroll.progress = max > 0 ? y / max : 0;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- smooth scroll bridge ---------- */

let lenisInstance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenisInstance = l;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: id === "hero" ? 0 : -24, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  // Move focus for keyboard and screen-reader users without a second jump.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
