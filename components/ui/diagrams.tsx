"use client";

import type { ProjectKind, Track } from "@/lib/data";
import { useReducedMotion } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/* Systems map: the three lanes of work at Zithara.AI                  */
/* ------------------------------------------------------------------ */

const lanes: { track: Track; label: string; nodes: string[] }[] = [
  { track: "genai", label: "GenAI & RAG", nodes: ["NL question", "Qdrant retrieve", "LangChain LLM", "SQL · reply · chart"] },
  { track: "growth", label: "Meta & Growth", nodes: ["IG / WA event", "Meta Graph API", "AI bot flow", "Engagement +60%"] },
  { track: "platform", label: "Platform", nodes: ["Tenant data", "Bulk import", "GrapeJS builder", "AWS SES send"] },
];

const NX = [14, 146, 278, 410];
const NW = 112;
const NH = 38;
const LY = [52, 146, 240];

export function SystemsMap({ active }: { active: Track | "all" }) {
  const reduced = useReducedMotion();
  return (
    <svg className="sysmap" viewBox="0 0 536 290" role="img" aria-labelledby="sysmap-title">
      <title id="sysmap-title">Systems map of work at Zithara.AI: GenAI and RAG, Meta and growth automation, and platform infrastructure lanes.</title>
      <defs>
        <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0H0V14" fill="none" className="sysmap__grid" />
        </pattern>
        <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8z" className="sysmap__arrow" />
        </marker>
      </defs>
      <rect width="536" height="290" fill="url(#grid)" opacity="0.5" />

      {/* Cross-lane links: the LLM powers bot flows; imports feed retrieval. */}
      <path d={`M${NX[2] + NW / 2} ${LY[0] + NH / 2} V${LY[1] - NH / 2}`} className={`sysmap__link${active === "all" || active !== "platform" ? " is-on" : ""}`} />
      <path d={`M${NX[1] + NW / 2} ${LY[2] - NH / 2} C ${NX[1] + 40} ${LY[1] + 20}, ${NX[1] + 30} ${LY[0] + 40}, ${NX[1] + NW / 2 - 10} ${LY[0] + NH / 2}`} className={`sysmap__link sysmap__link--soft${active === "all" || active === "platform" ? " is-on" : ""}`} />

      {lanes.map((lane, li) => {
        const on = active === "all" || active === lane.track;
        const y = LY[li];
        const flowPath = `M${NX[0] + NW} ${y} H${NX[3]}`;
        return (
          <g key={lane.track} className={`sysmap__lane${on ? " is-on" : ""}`}>
            <text x={NX[0]} y={y - NH / 2 - 9} className="sysmap__lane-label">
              {String(li + 1).padStart(2, "0")} · {lane.label}
            </text>
            <path d={flowPath} className="sysmap__flow" markerEnd="url(#arrow)" />
            {lane.nodes.map((n, ni) => (
              <g key={n} transform={`translate(${NX[ni]} ${y - NH / 2})`}>
                <rect width={NW} height={NH} rx="6" className={`sysmap__node${ni === 2 ? " sysmap__node--core" : ""}`} />
                <text x={NW / 2} y={NH / 2 + 4} textAnchor="middle" className="sysmap__text">
                  {n}
                </text>
              </g>
            ))}
            {on && !reduced && (
              <circle r="3.2" className={li === 1 ? "sysmap__packet sysmap__packet--hot" : "sysmap__packet"}>
                <animateMotion dur={`${2.6 + li * 0.5}s`} repeatCount="indefinite" path={flowPath} />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Per-project schematic illustrations                                  */
/* ------------------------------------------------------------------ */

function Packet({ path, dur = 3, hot = false }: { path: string; dur?: number; hot?: boolean }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <circle r="2.6" className={hot ? "schem__packet schem__packet--hot" : "schem__packet"}>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

const schematics: Record<ProjectKind, React.ReactNode> = {
  nl2sql: (
    <>
      <rect x="8" y="38" width="62" height="30" rx="15" className="schem__shape" />
      <text x="39" y="57" textAnchor="middle" className="schem__label">&quot;sales by city?&quot;</text>
      <path d="M70 53 H96" className="schem__wire" />
      <g transform="translate(96 30)">
        <rect width="54" height="46" rx="5" className="schem__shape schem__shape--core" />
        <text x="27" y="20" textAnchor="middle" className="schem__label">schema</text>
        <text x="27" y="33" textAnchor="middle" className="schem__label">+ LLM</text>
      </g>
      <path d="M150 53 H170" className="schem__wire" />
      <text x="160" y="44" textAnchor="middle" className="schem__label schem__label--hot">SQL</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={176 + i * 12} y={86 - [30, 46, 22, 52, 38][i]} width="8" height={[30, 46, 22, 52, 38][i]} rx="1.5" className="schem__bar" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
      <path d="M172 90 H238" className="schem__axis" />
      <Packet path="M70 53 H96 M150 53 H176" dur={2.4} />
    </>
  ),
  agents: (
    <>
      <circle cx="120" cy="60" r="20" className="schem__shape schem__shape--core" />
      <text x="120" y="64" textAnchor="middle" className="schem__label">agent</text>
      {[
        { x: 30, y: 24, t: "WhatsApp" },
        { x: 30, y: 96, t: "Instagram" },
        { x: 210, y: 24, t: "Web chat" },
        { x: 210, y: 96, t: "Qdrant" },
      ].map((n, i) => (
        <g key={n.t}>
          <path d={`M${n.x} ${n.y} L120 60`} className="schem__wire" />
          <circle cx={n.x} cy={n.y} r="6" className={i === 3 ? "schem__dot schem__dot--hot" : "schem__dot"} />
          <text x={n.x} y={n.y + (n.y < 60 ? -11 : 18)} textAnchor="middle" className="schem__label">{n.t}</text>
          <Packet path={`M${n.x} ${n.y} L120 60`} dur={1.8 + i * 0.4} hot={i === 3} />
        </g>
      ))}
      <circle cx="120" cy="60" r="32" className="schem__orbit" />
    </>
  ),
  insights: (
    <>
      <g transform="translate(10 26)">
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={c * 20} y={r * 13} width="18" height="11" className="schem__cell" />))}
      </g>
      <path d="M74 58 H100" className="schem__wire" />
      <text x="120" y="63" textAnchor="middle" className="schem__label schem__label--hot">{"{ code }"}</text>
      <path d="M142 58 H160" className="schem__wire" />
      <path d="M166 92 L184 70 L200 78 L216 46 L232 54" className="schem__line" />
      {[[166, 92], [184, 70], [200, 78], [216, 46], [232, 54]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.6" className="schem__dot" />
      ))}
      <path d="M162 98 H238" className="schem__axis" />
      <Packet path="M74 58 H100 M142 58 H166" dur={2.2} />
    </>
  ),
  shopping: (
    <>
      <rect x="10" y="22" width="88" height="26" rx="8" className="schem__shape" />
      <text x="54" y="39" textAnchor="middle" className="schem__label">&quot;running shoes?&quot;</text>
      <g transform="translate(14 64)">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={i * 6} y={18 - [6, 12, 18, 9, 14, 20, 8, 16, 11, 6, 15, 9, 13, 5][i] / 2} width="3" height={[6, 12, 18, 9, 14, 20, 8, 16, 11, 6, 15, 9, 13, 5][i]} rx="1.5" className="schem__wave" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </g>
      <path d="M100 35 C 125 35, 125 60, 140 60" className="schem__wire" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${144 + i * 32} ${38 + (i % 2) * 8})`}>
          <rect width="28" height="40" rx="4" className={i === 1 ? "schem__shape schem__shape--core" : "schem__shape"} />
          <rect x="5" y="6" width="18" height="14" rx="2" className="schem__cell" />
          <path d="M5 27 H23 M5 32 H16" className="schem__axis" />
        </g>
      ))}
      <Packet path="M100 35 C 125 35, 125 60, 144 60" dur={2} hot />
    </>
  ),
  exam: (
    <>
      <g transform="translate(14 18)">
        <rect width="70" height="86" rx="4" className="schem__shape" />
        {[14, 24, 34, 44, 54, 64].map((y, i) => (
          <path key={y} d={`M10 ${y} H${[56, 48, 60, 40, 52, 30][i]}`} className="schem__axis" />
        ))}
      </g>
      <path d="M86 60 H120" className="schem__wire" />
      <text x="103" y="52" textAnchor="middle" className="schem__label">NLP</text>
      <path d="M140 86 A 46 46 0 0 1 226 86" className="schem__track" />
      <path d="M140 86 A 46 46 0 0 1 216 54" className="schem__gauge" />
      <text x="183" y="82" textAnchor="middle" className="schem__big">85%</text>
      <text x="183" y="100" textAnchor="middle" className="schem__label">accuracy</text>
      <Packet path="M86 60 H134" dur={1.8} />
    </>
  ),
  agri: (
    <>
      <path d="M40 92 C 40 56, 64 34, 96 30 C 94 64, 72 88, 40 92 Z" className="schem__shape schem__shape--core" />
      <path d="M40 92 C 56 72, 70 56, 90 38" className="schem__wire" />
      <path d="M112 84 L132 84 L142 58 L154 98 L166 46 L178 84 L232 84" className="schem__line" />
      <circle cx="166" cy="46" r="4" className="schem__dot schem__dot--hot" />
      <text x="190" y="40" className="schem__label">signal</text>
      <path d="M108 104 H236" className="schem__axis" />
      <Packet path="M112 84 L132 84 L142 58 L154 98 L166 46 L178 84 L232 84" dur={3} hot />
    </>
  ),
};

export function ProjectSchematic({ kind }: { kind: ProjectKind }) {
  return (
    <svg className="schem" viewBox="0 0 248 120" aria-hidden="true">
      {schematics[kind]}
    </svg>
  );
}
