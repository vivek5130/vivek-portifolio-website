"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Seeded, organic neural aura in the photo's pixel space (900 × 910)  */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
/** Head + hair keep-out ellipse: nothing is drawn across the face. */
const HEAD = { x: 452, y: 262, rx: 205, ry: 250 };

type AuraNode = { x: number; y: number; z: number; r: number; hub: boolean; delay: number; dur: number };
type AuraEdge = { d: string; z: number; delay: number };

function buildAura() {
  const rand = mulberry32(20250501);
  const nodes: AuraNode[] = [];
  let guard = 0;
  while (nodes.length < 22 && guard++ < 4000) {
    // Arc from just below the left ear, over the crown, to below the right ear.
    const a = Math.PI * (-0.12 + rand() * 1.24);
    const k = 1.08 + Math.pow(rand(), 1.6) * 0.42;
    const x = HEAD.x + Math.cos(a) * HEAD.rx * k * 1.12;
    const y = HEAD.y - Math.sin(a) * HEAD.ry * k * 0.92;
    if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 70 ** 2)) continue;
    const z = rand();
    const hub = rand() < 0.08;
    nodes.push({ x: r1(x), y: r1(y), z, r: r1(hub ? 6.5 : 1.8 + z * 3.4), hub, delay: r1(rand() * 4), dur: r1(2.2 + rand() * 3) });
  }

  const edges: AuraEdge[] = [];
  const paths: string[] = [];
  const seen = new Set<string>();
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, rand() < 0.2 ? 2 : 1);
    near.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      const m = nodes[j];
      // Curve each synapse a little to one side.
      const mx = (n.x + m.x) / 2, my = (n.y + m.y) / 2;
      const len = Math.hypot(m.x - n.x, m.y - n.y);
      const bend = (rand() - 0.5) * 0.55 * len;
      const cx = mx + (-(m.y - n.y) / len) * bend;
      const cy = my + ((m.x - n.x) / len) * bend;
      const d = `M${n.x} ${n.y} Q${r1(cx)} ${r1(cy)} ${m.x} ${m.y}`;
      edges.push({ d, z: (n.z + m.z) / 2, delay: r1(0.4 + rand() * 1.4) });
      paths.push(d);
    });
  });

  // Signals on a random subset of synapses, with random speed, phase and direction.
  const signals = Array.from({ length: 4 }, () => {
    const e = edges[Math.floor(rand() * edges.length)];
    return { d: e.d, dur: r1(3 + rand() * 3), begin: r1(-rand() * 4), hot: rand() < 0.25, reverse: rand() < 0.5 };
  });

  return { nodes, edges, signals };
}

const aura = buildAura();

export function Portrait() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const glowX = useTransform(sx, (v) => v * -8);
  const glowY = useTransform(sy, (v) => v * -8);
  const farX = useTransform(sx, (v) => v * 8);
  const farY = useTransform(sy, (v) => v * 8);
  const nearX = useTransform(sx, (v) => v * 20);
  const nearY = useTransform(sy, (v) => v * 16);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduced]);

  const far = aura.nodes.filter((n) => n.z < 0.4);
  const near = aura.nodes.filter((n) => n.z >= 0.4);

  return (
    <figure className={`portrait${active ? " is-active" : ""}`} onPointerEnter={() => setActive(true)} onPointerLeave={() => setActive(false)}>
      <div className="portrait__stage">
        <motion.div className="portrait__glow" style={{ x: glowX, y: glowY }} aria-hidden="true" />

        <svg className="portrait__net" viewBox="0 0 900 910" aria-hidden="true" focusable="false">
          {/* Far layer: small, soft, slow */}
          <motion.g style={{ x: farX, y: farY }} className="aura__far">
            {far.map((n, i) => (
              <circle key={i} cx={n.x} cy={n.y} r={n.r} className="aura__node" style={{ animationDelay: `${n.delay}s`, animationDuration: `${n.dur}s` }} />
            ))}
          </motion.g>
          {/* Synapses + signals */}
          <motion.g style={{ x: farX, y: farY }}>
            {aura.edges.map((e, i) => (
              <path key={i} d={e.d} className="aura__edge" style={{ opacity: 0.35 + e.z * 0.55, animationDelay: `${e.delay}s` }} />
            ))}
            {!reduced &&
              aura.signals.map((s, i) => (
                <circle key={i} r="3.2" className={`aura__signal${s.hot ? " is-hot" : ""}`}>
                  <animateMotion dur={`${s.dur}s`} begin={`${s.begin}s`} repeatCount="indefinite" path={s.d} keyPoints={s.reverse ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
                </circle>
              ))}
          </motion.g>
          {/* Near layer: brighter, larger, moves most */}
          <motion.g style={{ x: nearX, y: nearY }}>
            {near.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={n.r}
                className={`aura__node${n.hub ? " is-hub" : ""}`}
                style={{ animationDelay: `${n.delay}s`, animationDuration: `${n.dur}s` }}
              />
            ))}
          </motion.g>
        </svg>

        {/* No parallax on the photo itself: sub-pixel transforms make it render soft. */}
        <div className="portrait__layer">
          <Image
            src="/vivek-portrait-hd.png"
            alt={`Portrait of ${profile.firstName} ${profile.lastName}`}
            width={1247}
            height={1261}
            sizes="(max-width: 760px) 560px, 720px"
            quality={90}
            priority
            className="portrait__img"
          />
        </div>
      </div>
      <figcaption className="portrait__caption">
        <span className="portrait__sep" aria-hidden="true" />
        <span className="mono">{profile.location}</span>
      </figcaption>
    </figure>
  );
}
