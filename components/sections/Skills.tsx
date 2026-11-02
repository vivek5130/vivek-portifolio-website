"use client";

import { useCallback, useState } from "react";
import { skillGroups } from "@/lib/data";
import { SkillCard, techById, techNodes, TechGraph, TechMark, type TechNode } from "../skills/TechGraph";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/motion";
import { Brackets, SectionHeader } from "../ui/primitives";

const LAYERS = ["Interface", "Services", "Intelligence", "Data"] as const;

/** The graph node a résumé skill name refers to, if it has one. */
const nodeByName = new Map<string, TechNode>(techNodes.flatMap((n) => [n.label, ...n.aliases].map((s) => [s.toLowerCase(), n] as const)));

/** Every skill group, always visible. Skills that are graph nodes open their card; the active one is lit. */
function SkillGroups({
  active,
  activeGroup,
  onPick,
  onGroup,
}: {
  active: string | null;
  activeGroup: string | null;
  onPick: (id: string) => void;
  onGroup: (id: string | null) => void;
}) {
  return (
    <div className="skill-groups" onPointerLeave={() => onGroup(null)}>
      {skillGroups.map((g) => (
        <div
          className={`skill-groups__group${g.id === activeGroup ? " is-active" : ""}`}
          key={g.id}
          onPointerEnter={() => onGroup(g.id)}
          onFocus={() => onGroup(g.id)}
          onBlur={() => onGroup(null)}
        >
          <p className="skill-groups__label">
            <Icon name={g.icon} size={16} />
            {g.label}
            <span className="mono">{String(g.items.length).padStart(2, "0")}</span>
          </p>
          <ul className="skill-groups__items" aria-label={`${g.label} skills`}>
            {g.items.map((s) => {
              const node = nodeByName.get(s.toLowerCase());
              return (
                <li key={s}>
                  {node ? (
                    <button
                      type="button"
                      className={`chip chip--link${node.id === active ? " is-on" : ""}`}
                      onClick={() => onPick(node.id)}
                      title={`See where I've used ${s}`}
                    >
                      <TechMark node={node} size={12} />
                      {s}
                    </button>
                  ) : (
                    <span className="chip">{s}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  // Clicking pins a technology's card; hovering previews one. The list on the right never changes.
  const [pinned, setPinned] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // Hovering a group in the list lights up its technologies in the graph (and hides any open card meanwhile).
  const [group, setGroup] = useState<string | null>(null);
  const active = group ? null : (preview ?? pinned);
  const isPinned = pinned !== null && (preview === null || preview === pinned);

  const pick = useCallback((id: string) => {
    setPreview(null);
    setPinned((p) => (p === id ? null : id));
  }, []);
  const close = useCallback(() => {
    setPreview(null);
    setPinned(null);
  }, []);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <SectionHeader id="skills-title" index="04" label="Technical skills" title="A connected stack, from interface to intelligence." emphasis={[6]} note="system graph" />

      <div className="skills__grid">
        <Reveal className="skills__viz">
          <Brackets />
          <div className="skills__legend mono" aria-hidden="true">
            {LAYERS.map((l) => (
              <span key={l} className={active && techById[active].layer === l ? "is-on" : undefined}>
                {l}
              </span>
            ))}
          </div>
          <TechGraph selected={active} pinned={isPinned} onPreview={setPreview} onPick={pick} onClose={close} group={group} />

          {/* Phones: the graph is too dense, so every technology is a tappable chip, with its card below. */}
          <div className="skills__chips" role="group" aria-label="Technologies">
            {techNodes.map((n) => (
              <button key={n.id} type="button" className={`chip${n.id === pinned ? " is-on" : ""}`} aria-pressed={n.id === pinned} onClick={() => pick(n.id)}>
                <TechMark node={n} size={13} />
                {n.label}
              </button>
            ))}
          </div>
          {pinned && <SkillCard id={pinned} pinned onPick={pick} onClose={close} className="skill-card--inline" />}

          <p className="figure__caption">
            <span className="mono">fig. 04</span> How the stack connects in my work — hover a technology to preview it, click to pin its card.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="skills__side">
          <SkillGroups active={active} activeGroup={group} onPick={pick} onGroup={setGroup} />
        </Reveal>
      </div>
    </section>
  );
}
