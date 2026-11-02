"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { experience, projects, skillGroups } from "@/lib/data";
import { brandColor, brandIcons, type BrandIcon } from "@/lib/techIcons";
import { Icon } from "../ui/Icon";
import { ease } from "../ui/motion";

export type Layer = "Interface" | "Services" | "Intelligence" | "Data" | "Infra";
export type TechNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  layer: Layer;
  note: string;
  /** Names this tech goes by in experience and project stacks. */
  aliases: string[];
  brand?: BrandIcon;
  glyph?: string;
  hub?: boolean;
};

/**
 * Positions are in a 1000 × 700 design space. Columns sit under the legend
 * (Interface, Services, Intelligence, Data); infra runs along the bottom.
 */
export const techNodes: TechNode[] = [
  { id: "nextjs", label: "Next.js", brand: "nextjs", x: 125, y: 90, layer: "Interface", note: "SSR apps & API routes", aliases: ["Next.js"] },
  { id: "react", label: "React", brand: "react", x: 125, y: 260, layer: "Interface", note: "Component-driven UIs", aliases: ["React"] },
  { id: "typescript", label: "TypeScript", brand: "typescript", x: 125, y: 430, layer: "Interface", note: "Typed front & back end", aliases: ["TypeScript"] },

  { id: "nodejs", label: "Node.js", brand: "nodejs", x: 375, y: 90, layer: "Services", note: "APIs & Meta Graph integrations", aliases: ["Node.js"] },
  { id: "express", label: "Express", brand: "express", x: 375, y: 260, layer: "Services", note: "REST services", aliases: ["Express"] },
  { id: "python", label: "Python", brand: "python", x: 375, y: 430, layer: "Services", note: "ML, NLP & data tooling", aliases: ["Python"] },

  { id: "langchain", label: "LangChain", brand: "langchain", x: 540, y: 90, layer: "Intelligence", note: "Chains, tools & retrieval", aliases: ["LangChain"] },
  { id: "langgraph", label: "LangGraph", brand: "langgraph", x: 710, y: 90, layer: "Intelligence", note: "Stateful multi-step agents", aliases: ["LangGraph"] },
  { id: "rag", label: "RAG", x: 625, y: 260, layer: "Intelligence", note: "Retrieval-augmented generation — the core of my AI work", aliases: ["RAG"], hub: true },
  { id: "huggingface", label: "Hugging Face", brand: "huggingface", x: 540, y: 430, layer: "Intelligence", note: "Transformers & embeddings", aliases: ["Hugging Face", "Transformers"] },
  { id: "tensorflow", label: "TensorFlow", brand: "tensorflow", x: 710, y: 430, layer: "Intelligence", note: "Model training", aliases: ["TensorFlow"] },

  { id: "qdrant", label: "Qdrant", brand: "qdrant", x: 875, y: 90, layer: "Data", note: "Vector database", aliases: ["Qdrant"] },
  { id: "postgresql", label: "PostgreSQL", brand: "postgresql", x: 875, y: 260, layer: "Data", note: "CRM data & NL2SQL target", aliases: ["PostgreSQL"] },
  { id: "mongodb", label: "MongoDB", brand: "mongodb", x: 875, y: 430, layer: "Data", note: "Product catalogue store", aliases: ["MongoDB"] },

  { id: "aws", label: "AWS", glyph: "λ", x: 375, y: 610, layer: "Infra", note: "Lambda functions, DynamoDB & SES email at scale", aliases: ["AWS"] },
  { id: "docker", label: "Docker", brand: "docker", x: 625, y: 610, layer: "Infra", note: "Containerised deploys", aliases: ["Docker"] },
];

export const techEdges: [string, string, string][] = [
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

export const techById: Record<string, TechNode> = Object.fromEntries(techNodes.map((n) => [n.id, n]));

export function neighbours(id: string) {
  return techEdges.flatMap(([a, b, label]) => (a === id ? [{ id: b, label }] : b === id ? [{ id: a, label }] : []));
}

/* ------------------------------------------------------------------ */
/* Where each technology was used, derived from experience & projects  */
/* ------------------------------------------------------------------ */

export type Usage = { title: string; where: string };

// Experience bullets cover the production systems; personal projects add the rest without duplicates.
const workItems: (Usage & { haystack: string })[] = [
  ...experience.roles.flatMap((r) =>
    r.highlights.map((h) => ({
      title: h.title,
      where: r.type === "Internship" ? "Internship" : "Full-time",
      haystack: `${h.stack.join(" ")} ${h.text}`,
    })),
  ),
  ...projects
    .filter((p) => !p.code.startsWith("SYS"))
    .map((p) => ({ title: p.title, where: "Project", haystack: `${p.stack.join(" ")} ${p.description}` })),
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-word, case-insensitive match for any of a node's names. */
function namesPattern(node: TechNode) {
  return new RegExp(`(^|[^\\w])(${[node.label, ...node.aliases].map(escape).join("|")})(?![\\w])`, "i");
}

/** Graph nodes in each résumé skill group, e.g. AWS belongs to "Data & Cloud" via "AWS Lambda". */
export const nodesByGroup: Record<string, Set<string>> = Object.fromEntries(
  skillGroups.map((g) => [g.id, new Set(techNodes.filter((n) => g.items.some((item) => namesPattern(n).test(item))).map((n) => n.id))]),
);

export function usedIn(node: TechNode): Usage[] {
  const re = namesPattern(node);
  return workItems.filter((w) => re.test(w.haystack)).map(({ title, where }) => ({ title, where }));
}

/* ------------------------------------------------------------------ */
/* Graph                                                               */
/* ------------------------------------------------------------------ */

/** Quadratic curve with a gentle, alternating bend. */
function curve(a: TechNode, b: TechNode, i: number) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const bend = (i % 2 ? 1 : -1) * len * 0.08;
  const cx = mx + (-(b.y - a.y) / len) * bend;
  const cy = my + ((b.x - a.x) / len) * bend;
  return { d: `M${a.x} ${a.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}` };
}

/** Compact card for one technology: what it is, where it was used, what it connects to. */
export function SkillCard({ id, pinned, onPick, onClose, className = "" }: { id: string; pinned: boolean; onPick: (id: string) => void; onClose: () => void; className?: string }) {
  const node = techById[id];
  const uses = useMemo(() => usedIn(node), [node]);
  const links = neighbours(id);

  return (
    <div className={`skill-card${pinned ? " is-pinned" : ""} ${className}`} role={pinned ? "dialog" : undefined} aria-label={`${node.label} details`}>
      <div className="skill-card__head">
        <span className="skill-card__mark">
          <TechMark node={node} size={18} />
        </span>
        <div>
          <p className="skill-card__layer mono">{node.layer}</p>
          <p className="skill-card__name">{node.label}</p>
        </div>
        {pinned && (
          <button type="button" className="skill-card__close" onClick={onClose} aria-label="Close details">
            <Icon name="close" size={14} />
          </button>
        )}
      </div>
      <p className="skill-card__note">{node.note}</p>

      {uses.length > 0 && (
        <>
          <p className="skill-card__sub mono">Used in</p>
          <ul className="skill-card__uses">
            {uses.map((u) => (
              <li key={u.title}>
                <span>{u.title}</span>
                <span className="skill-card__where mono">{u.where}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="skill-card__sub mono">Connects to</p>
      <ul className="skill-card__links">
        {links.map((l) => (
          <li key={l.id}>
            <button type="button" className="skill-card__link" onClick={() => onPick(l.id)} tabIndex={pinned ? 0 : -1}>
              <TechMark node={techById[l.id]} size={12} />
              <span className="skill-card__link-name">{techById[l.id].label}</span>
              <span className="skill-card__link-why">{l.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {!pinned && <p className="skill-card__hint mono">Click to pin</p>}
    </div>
  );
}

type GraphProps = {
  /** Node to highlight (hovered or pinned); null shows the whole graph evenly. */
  selected: string | null;
  /** Whether the selection is pinned by a click (vs. a hover preview). */
  pinned: boolean;
  /** Hover / focus preview; null when the pointer leaves a node. */
  onPreview: (id: string | null) => void;
  /** Click: pin a node (clicking the pinned node again unpins it). */
  onPick: (id: string) => void;
  onClose: () => void;
  /** Skill group hovered in the list: its nodes light up (ignored while a node is selected). */
  group?: string | null;
};

export function TechGraph({ selected, pinned, onPreview, onPick, onClose, group = null }: GraphProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  const curves = useMemo(() => techEdges.map(([a, b], i) => curve(techById[a], techById[b], i)), []);
  const linked = useMemo(() => (selected ? new Set([selected, ...neighbours(selected).map((n) => n.id)]) : null), [selected]);
  const card = selected ? techById[selected] : null;
  const inGroup = !selected && group ? nodesByGroup[group] : null;

  // Escape closes a pinned card.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned, onClose]);

  return (
    <div
      ref={ref}
      className="techgraph"
      onClick={(e) => {
        // A click on empty space (not a node or the card) closes a pinned card.
        if (pinned && !(e.target as HTMLElement).closest(".tg-node, .skill-card")) onClose();
      }}
    >
      <span className="techgraph__infra mono" aria-hidden="true">
        Infra
      </span>

      <svg className="techgraph__edges" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="edge-hot" x1="0" x2="1">
            <stop offset="0" stopColor="#3ee7ff" />
            <stop offset="1" stopColor="#ff8a3d" />
          </linearGradient>
        </defs>
        {curves.map((c, i) => {
          const [a, b] = techEdges[i];
          const on = selected ? a === selected || b === selected : inGroup ? inGroup.has(a) || inGroup.has(b) : false;
          return (
            <g key={i} className={`tg-edge${on ? " is-on" : ""}${inView ? " is-in" : ""}`} style={{ transitionDelay: `${0.3 + i * 0.04}s` }}>
              <path d={c.d} vectorEffect="non-scaling-stroke" />
              {inView && !reduced && on && (
                <circle r="3.2" className="tg-packet">
                  <animateMotion dur={`${2.2 + (i % 4) * 0.4}s`} repeatCount="indefinite" path={c.d} />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {techNodes.map((n, i) => {
        const brand = n.brand ? brandIcons[n.brand] : null;
        const color = brand ? brandColor(brand.hex) : "#3ee7ff";
        const state = linked
          ? n.id === selected
            ? "is-focus"
            : linked.has(n.id)
              ? "is-linked"
              : "is-dim"
          : inGroup
            ? inGroup.has(n.id)
              ? "is-group"
              : "is-dim"
            : "";
        // The button only positions (anchored on its icon's centre); the inner span animates,
        // so the entrance animation can't override the positioning transform.
        return (
          <button
            key={n.id}
            type="button"
            className={`tg-node ${state}${n.hub ? " tg-node--hub" : ""}`}
            style={{ left: `${n.x / 10}%`, top: `${n.y / 7}%`, ["--brand" as string]: color }}
            onPointerEnter={() => onPreview(n.id)}
            onPointerLeave={() => onPreview(null)}
            onFocus={() => onPreview(n.id)}
            onBlur={() => onPreview(null)}
            onClick={() => onPick(n.id)}
            aria-pressed={n.id === selected}
            aria-label={`${n.label}: ${n.note}`}
          >
            <motion.span
              className="tg-node__inner"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.04, ease }}
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
            </motion.span>
          </button>
        );
      })}

      {/* Floating card beside the active node; it opens toward the side with more room. */}
      <AnimatePresence>
        {card && (
          <motion.div
            key={card.id}
            className={`tg-card tg-card--${card.x > 500 ? "left" : "right"}${card.hub ? " tg-card--hub" : ""}`}
            style={{ left: `${card.x / 10}%`, top: `${card.y / 7}%`, ["--ty" as string]: card.y < 200 ? "-12%" : card.y > 450 ? "-88%" : "-50%" }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease }}
          >
            <SkillCard id={card.id} pinned={pinned} onPick={onPick} onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Small brand mark for a node, used by the detail panel and the phone chip list. */
export function TechMark({ node, size = 18 }: { node: TechNode; size?: number }) {
  const brand = node.brand ? brandIcons[node.brand] : null;
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d={brand.path} fill={brandColor(brand.hex)} />
      </svg>
    );
  }
  if (node.hub) return <Icon name="brain" size={size} />;
  return (
    <span className="tg-mark-glyph" aria-hidden="true">
      {node.glyph}
    </span>
  );
}
