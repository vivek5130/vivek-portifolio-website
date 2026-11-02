"use client";

import Image from "next/image";
import { Fragment } from "react";
import { experience, type Role } from "@/lib/data";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/motion";
import { Brackets, SectionHeader, SpotlightCard } from "../ui/primitives";

/** "1 yr 6 mos"-style length between two dates; `end` defaults to today. */
function duration(startIso: string, endIso?: string) {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : new Date();
  const months = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + (endIso ? 0 : 1));
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}

/** Headline numbers for the side card: "−50% handling time" → value "−50%", what "handling time". */
const results = experience.roles.flatMap((r) =>
  r.highlights
    .filter((h) => h.impact)
    .map((h) => {
      const [value, ...what] = h.impact!.split(" ");
      return { value, what: what.join(" "), source: h.title };
    }),
);
const [current, ...earlier] = experience.roles;

function RoleCard({ role, isCurrent }: { role: Role; isCurrent: boolean }) {
  return (
    <li className="tl__item">
      <span className={`tl__dot${isCurrent ? " is-current" : ""}`} aria-hidden="true" />
      <Reveal>
        <article className="tl__card">
          <header className="tl__head">
            <div>
              <h3 className="tl__title">{role.title}</h3>
              <span className={`tl__badge${isCurrent ? " is-current" : ""}`}>{role.type}</span>
            </div>
            <p className="tl__period mono">
              {role.period}
              <span className="dim" suppressHydrationWarning>
                {duration(role.start, role.end)}
              </span>
            </p>
          </header>

          <p className="tl__focus">
            <span className="mono">focus</span>
            {role.focus}
          </p>

          <ul className="tl__list">
            {role.highlights.map((h) => (
              <li className="tl__point" key={h.title}>
                <p>
                  <strong>{h.title}</strong> — {h.text}
                </p>
                <div className="tl__foot">
                  {h.impact && (
                    <span className="impact">
                      <Icon name="bolt" size={12} />
                      {h.impact}
                    </span>
                  )}
                  <span className="tl__stack mono">{h.stack.join(" · ")}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </Reveal>
    </li>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <SectionHeader id="experience-title" index="02" label="Experience" title="From intern to engineer, shipping AI to production." emphasis={[5]} note="timeline" />

      <div className="exp__grid">
        <aside className="exp__aside">
          <Reveal>
            <SpotlightCard className="company">
              <Brackets />
              <div className="company__top">
                <span className="company__logo">
                  <Image src="/zithara_logo.png" alt={`${experience.company} logo`} width={4500} height={4500} sizes="56px" />
                </span>
                <div>
                  <h3 className="company__role">{experience.company}</h3>
                  <p className="company__name">{experience.location}</p>
                </div>
              </div>
              <p className="company__context">{experience.context}</p>
              <dl className="company__meta">
                <div>
                  <dt className="mono dim">since</dt>
                  <dd>May 2025</dd>
                </div>
                <div>
                  <dt className="mono dim">tenure</dt>
                  <dd suppressHydrationWarning>
                    <span className="live-dot" aria-hidden="true" /> {duration(experience.start)}
                  </dd>
                </div>
                <div>
                  <dt className="mono dim">path</dt>
                  <dd>Intern → SDE</dd>
                </div>
              </dl>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="results">
              <p className="results__label mono">Key results</p>
              <ul>
                {results.map((r) => (
                  <li key={r.source}>
                    <span className="results__value">{r.value}</span>
                    <span className="results__what">
                      {r.what}
                      <span className="dim">{r.source}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </aside>

        <ol className="tl">
          <RoleCard role={current} isCurrent />
          {earlier.map((role) => (
            <Fragment key={role.title}>
              <li className="tl__milestone" aria-label={`Converted to full-time, ${current.period.split(" — ")[0]}`}>
                <span className="tl__milestone-mark" aria-hidden="true" />
                <span className="mono">Converted to full-time · {current.period.split(" — ")[0]}</span>
              </li>
              <RoleCard role={role} isCurrent={false} />
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
