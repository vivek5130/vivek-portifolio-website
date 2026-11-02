"use client";

import type { ProjectKind } from "@/lib/data";
import { useReducedMotion } from "@/lib/hooks";

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
  metaads: (
    <>
      {/* Ad creative */}
      <g transform="translate(8 30)">
        <rect width="48" height="58" rx="5" className="schem__shape" />
        <rect x="6" y="6" width="36" height="22" rx="2" className="schem__cell" />
        <path d="M6 36 H42 M6 42 H30" className="schem__axis" />
        <rect x="6" y="48" width="20" height="5" rx="2.5" className="schem__shape schem__shape--core" />
      </g>
      <text x="32" y="104" textAnchor="middle" className="schem__label">ad</text>
      <path d="M56 59 H92" className="schem__wire" />
      {/* Meta Ads API */}
      <g transform="translate(92 38)">
        <rect width="62" height="42" rx="5" className="schem__shape schem__shape--core" />
        <text x="31" y="18" textAnchor="middle" className="schem__label">Meta</text>
        <text x="31" y="31" textAnchor="middle" className="schem__label">Ads API</text>
      </g>
      {/* CRM, with audiences going out and offline conversions coming back */}
      <circle cx="214" cy="59" r="20" className="schem__shape" />
      <text x="214" y="63" textAnchor="middle" className="schem__label">CRM</text>
      <path d="M194 50 H154" className="schem__wire" />
      <text x="174" y="42" textAnchor="middle" className="schem__label">audiences</text>
      <path d="M154 68 H194" className="schem__wire" />
      <text x="174" y="84" textAnchor="middle" className="schem__label schem__label--hot">CAPI</text>
      <Packet path="M56 59 H92" dur={1.8} />
      <Packet path="M194 50 H154" dur={2.2} />
      <Packet path="M194 68 H154" dur={2.6} hot />
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
