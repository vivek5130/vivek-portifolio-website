"use client";

import { useState } from "react";
import { skillGroups } from "@/lib/data";
import { TechGraph, type TechGroup } from "../skills/TechGraph";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/motion";
import { Brackets, SectionHeader } from "../ui/primitives";

export function Skills() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <SectionHeader id="skills-title" index="04" label="Technical skills" title="A connected stack, from interface to intelligence." emphasis={[6]} note="system graph" />

      <div className="skills__grid">
        <Reveal className="skills__viz">
          <Brackets />
          <div className="skills__legend mono" aria-hidden="true">
            <span>Interface</span>
            <span>Services</span>
            <span>Intelligence</span>
            <span>Data</span>
          </div>
          <TechGraph activeGroup={active === null ? null : (skillGroups[active].id as TechGroup)} />
          <p className="figure__caption">
            <span className="mono">fig. 04</span> How the stack connects in my work — hover a technology to trace its links.
          </p>
        </Reveal>

        <ul className="skills__list" onPointerLeave={() => setActive(null)}>
          {skillGroups.map((g, i) => (
            <Reveal as="li" key={g.id} delay={i * 0.06} className={`skill-group${i === active ? " is-active" : ""}`}>
              <div onPointerEnter={() => setActive(i)}>
                <button
                  type="button"
                  className="skill-group__head"
                  aria-pressed={i === active}
                  onClick={() => setActive(i === active ? null : i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="skill-group__icon">
                    <Icon name={g.icon} size={20} />
                  </span>
                  <span className="skill-group__label">{g.label}</span>
                  <span className="skill-group__count mono">{String(g.items.length).padStart(2, "0")}</span>
                </button>
                <ul className="skill-group__items" aria-label={`${g.label} skills`}>
                  {g.items.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
