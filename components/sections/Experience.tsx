"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { experience, trackMeta, type Track } from "@/lib/data";
import { SystemsMap } from "../ui/diagrams";
import { Icon } from "../ui/Icon";
import { ease, Reveal } from "../ui/motion";
import { Brackets, Chip, SectionHeader, SpotlightCard } from "../ui/primitives";

type Filter = Track | "all";

function tenure(startIso: string) {
  const start = new Date(startIso);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth() + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ");
}

export function Experience() {
  const [filter, setFilter] = useState<Filter>("all");
  const items = useMemo(
    () => experience.achievements.map((a, i) => ({ ...a, n: i + 1 })).filter((a) => filter === "all" || a.track === filter),
    [filter],
  );
  const filters: Filter[] = ["all", "genai", "growth", "platform"];

  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <SectionHeader id="experience-title" index="02" label="Experience" title="Shipping GenAI to production at Zithara.AI." emphasis={[1]} note="field notes" />

      <div className="exp__grid">
        <aside className="exp__aside">
          <Reveal>
            <SpotlightCard className="company">
              <Brackets />
              <div className="company__top">
                <span className="company__logo" aria-hidden="true">
                  Z
                </span>
                <div>
                  <h3 className="company__role">{experience.role}</h3>
                  <p className="company__name">
                    {experience.company} <span className="dim">· {experience.location}</span>
                  </p>
                </div>
              </div>
              <p className="company__context">{experience.context}</p>
              <dl className="company__meta">
                <div>
                  <dt className="mono dim">period</dt>
                  <dd>{experience.period}</dd>
                </div>
                <div>
                  <dt className="mono dim">tenure</dt>
                  <dd suppressHydrationWarning>
                    <span className="live-dot" aria-hidden="true" /> {tenure(experience.start)}
                  </dd>
                </div>
                <div>
                  <dt className="mono dim">shipped</dt>
                  <dd>{experience.achievements.length} systems</dd>
                </div>
              </dl>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="filters" role="group" aria-label="Filter achievements by track">
              {filters.map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} className={filter === f ? "is-active" : undefined} onClick={() => setFilter(f)}>
                  {filter === f && <motion.span layoutId="filter-pill" className="filters__pill" transition={{ duration: 0.4, ease }} />}
                  <span className="filters__label">{f === "all" ? "All work" : trackMeta[f].label}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="figure">
            <SystemsMap active={filter} />
            <p className="figure__caption">
              <span className="mono">fig. 03</span> Systems map — {filter === "all" ? "three lanes of production work" : trackMeta[filter].blurb.toLowerCase()}.
            </p>
          </Reveal>
        </aside>

        <LayoutGroup>
          <motion.ol className="achievements" layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((a) => (
                <motion.li
                  key={a.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease }}
                  className="achievement"
                >
                  <span className="achievement__n mono">{String(a.n).padStart(2, "0")}</span>
                  <div className="achievement__body">
                    <div className="achievement__head">
                      <h3>{a.title}</h3>
                      {a.impact && (
                        <span className="impact">
                          <Icon name="bolt" size={13} />
                          {a.impact}
                        </span>
                      )}
                    </div>
                    <p>{a.detail}</p>
                    <div className="achievement__tags">
                      <Chip tone="cyan">{trackMeta[a.track].label}</Chip>
                      {a.stack.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        </LayoutGroup>
      </div>
    </section>
  );
}
