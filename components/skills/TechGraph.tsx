"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { brandIcons, type BrandIcon } from "@/lib/techIcons";
import { Icon } from "../ui/Icon";
import { ease } from "../ui/motion";

type Group = "ai" | "languages" | "web" | "data" | "ops";
type TechNode = { id: string; label: string; x: number; y: number; group: Group; note: string; brand?: BrandIcon; glyph?: string; hub?: boolean };

/** Positions are in a 1000 × 700 design space. */
const nodes: TechNode[] = [
  { id: "nextjs", label: "Next.js", brand: "nextjs", x: 110, y: 140, group: "web", note: "SSR apps & API routes" },
  { id: "react", label: "React", brand: "react", x: 80, y: 330, group: "web", note: "Component-driven UIs" },
  { id: "typescript", label: "TypeScript", brand: "typescript", x: 140, y: 510, group: "languages", note: "Typed front & back end" },
  { id: "mongodb", label: "MongoDB", brand: "mongodb", x: 270, y: 640, group: "data", note: "Shopping-assistant catalogue" },
  { id: "aws", label: "AWS", glyph: "λ", x: 330, y: 50, group: "ops", note: "Lambda functions, DynamoDB & SES email at scale" },
  { id: "nodejs", label: "Node.js", brand: "nodejs", x: 330, y: 240, group: "web", note: "APIs & Meta Graph integrations" },
  { id: "express", label: "Express", brand: "express", x: 330, y: 420, group: "web", note: "REST services" },
  { id: "docker", label: "Docker", brand: "docker", x: 560, y: 40, group: "ops", note: "Containerised deploys" },
  { id: "python", label: "Python", brand: "python", x: 450, y: 600, group: "languages", note: "ML, NLP & data tooling" },
  { id: "langchain", label: "LangChain", brand: "langchain", x: 570, y: 170, group: "ai", note: "Chains, tools & retrieval" },
  { id: "rag", label: "RAG", x: 610, y: 370, group: "ai", note: "Retrieval-augmented generation — the core of my AI work", hub: true },
  { id: "tensorflow", label: "TensorFlow", brand: "tensorflow", x: 640, y: 620, group: "ai", note: "Model training" },
  { id: "langgraph", label: "LangGraph", brand: "langgraph", x: 800, y: 90, group: "ai", note: "Stateful multi-step agents" },
  { id: "huggingface", label: "Hugging Face", brand: "huggingface", x: 830, y: 560, group: "ai", note: "Transformers & embeddings" },
  { id: "qdrant", label: "Qdrant", brand: "qdrant", x: 900, y: 250, group: "data", note: "Vector database" },
  { id: "postgresql", label: "PostgreSQL", brand: "postgresql", x: 910, y: 410, group: "data", note: "CRM data & NL2SQL target" },
];

const edges: [string, string, string][] = [
  ["react", "nextjs", "UI layer"],
  ["typescript", "react", "typed components"],
  ["typescript", "nodejs", "typed services"],
  ["nextjs", "nodejs", "API routes"],
  ["nodejs", "express", "REST APIs"],
  ["express", "mongodb", "product catalogue"],
  ["aws", "nodejs", "Lambda · SES"],
  ["docker", "nodejs", "containers"],
  ["nodejs", "langchain", "LLM orchestration"],
  ["python", "langchain", "Python pipelines"],
  ["langchain", "langgraph", "agent graphs"],
  ["langchain", "rag", "retrieval chains"],
  ["langgraph", "rag", "agentic RAG"],
  ["rag", "qdrant", "vector search"],
  ["rag", "postgresql", "NL2SQL"],
  ["huggingface", "rag", "embeddings"],
  ["python", "huggingface", "transformers"],
  ["python", "tensorflow", "model training"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

/** Quadratic curve with a gentle, alternating bend; returns the path and its midpoint. */
function curve(a: TechNode, b: TechNode, i: number) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const bend = (i % 2 ? 1 : -1) * len * 0.12;
  const cx = mx + (-(b.y - a.y) / len) * bend;
  const cy = my + ((b.x - a.x) / len) * bend;
  return {
    d: `M${a.x} ${a.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`,
    mid: { x: 0.25 * a.x + 0.5 * cx + 0.25 * b.x, y: 0.25 * a.y + 0.5 * cy + 0.25 * b.y },
  };
}

/** White-out near-black brand colours so they read on the dark background. */
function brandColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return lum < 60 ? "#e7eeff" : hex;
}

export function TechGraph({ activeGroup }: { activeGroup: Group | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [4, -4]), { stiffness: 80, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-5, 5]), { stiffness: 80, damping: 20 });

  const curves = useMemo(() => edges.map(([a, b], i) => curve(byId[a], byId[b], i)), []);
  const linked = useMemo(() => {
    if (!hover) return null;
    const set = new Set([hover]);
    edges.forEach(([a, b]) => {
      if (a === hover) set.add(b);
      if (b === hover) set.add(a);
    });
    return set;
  }, [hover]);

  const nodeState = (n: TechNode) => {
    if (linked) return linked.has(n.id) ? (n.id === hover ? "is-focus" : "is-linked") : "is-dim";
    if (activeGroup) return n.group === activeGroup ? "is-group" : "is-dim";
    return "";
  };
  const edgeOn = (a: string, b: string) => (linked ? a === hover || b === hover : activeGroup ? byId[a].group === activeGroup || byId[b].group === activeGroup : false);
  const focused = hover ? byId[hover] : null;

  return (
    <motion.div
      ref={ref}
      className={`techgraph${linked || activeGroup ? " has-focus" : ""}`}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
        setHover(null);
      }}
    >
      <svg className="techgraph__edges" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="edge-hot" x1="0" x2="1">
            <stop offset="0" stopColor="#3ee7ff" />
            <stop offset="1" stopColor="#ff8a3d" />
          </linearGradient>
        </defs>
        {curves.map((c, i) => {
          const [a, b] = edges[i];
          const on = edgeOn(a, b);
          return (
            <g key={i} className={`tg-edge${on ? " is-on" : ""}`}>
              <motion.path
                d={c.d}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : undefined}
                transition={{ duration: 1.4, delay: 0.3 + i * 0.05, ease }}
                vectorEffect="non-scaling-stroke"
              />
              {inView && !reduced && (
                <circle r="3.2" className="tg-packet">
                  <animateMotion dur={`${2.6 + (i % 5) * 0.55}s`} begin={`${-(i * 0.7) % 3}s`} repeatCount="indefinite" path={c.d} />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Edge labels for the focused node */}
      {hover &&
        curves.map((c, i) => {
          const [a, b, label] = edges[i];
          if (a !== hover && b !== hover) return null;
          return (
            <span key={label} className="tg-edge-label" style={{ left: `${c.mid.x / 10}%`, top: `${c.mid.y / 7}%` }}>
              {label}
            </span>
          );
        })}

      {nodes.map((n, i) => {
        const brand = n.brand ? brandIcons[n.brand] : null;
        const color = brand ? brandColor(brand.hex) : "#3ee7ff";
        return (
          <motion.button
            key={n.id}
            type="button"
            className={`tg-node ${nodeState(n)}${n.hub ? " tg-node--hub" : ""}`}
            style={{ left: `${n.x / 10}%`, top: `${n.y / 7}%`, ["--brand" as string]: color, ["--float" as string]: `${(i % 4) * 0.7}s` }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease }}
            onPointerEnter={() => setHover(n.id)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
            aria-label={`${n.label}: ${n.note}`}
          >
            <span className="tg-node__icon">
              {brand ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={brand.path} fill={color} />
                </svg>
              ) : n.hub ? (
                <Icon name="brain" size={30} />
              ) : (
                <span className="tg-node__glyph">{n.glyph}</span>
              )}
            </span>
            <span className="tg-node__label">{n.label}</span>
          </motion.button>
        );
      })}

      <div className={`tg-tip${focused ? " is-on" : ""}`} aria-live="polite">
        {focused && (
          <>
            <span className="mono">{focused.label}</span>
            {focused.note}
          </>
        )}
      </div>
    </motion.div>
  );
}

export type { Group as TechGroup };
