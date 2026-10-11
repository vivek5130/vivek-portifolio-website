"use client";

import { motion } from "framer-motion";
import { credentials, education } from "@/lib/data";
import { Icon } from "../ui/Icon";
import { ease, Reveal, RevealGroup, RevealItem } from "../ui/motion";
import { Brackets, Chip, SectionHeader, SpotlightCard } from "../ui/primitives";

const kindLabel = { cert: "Certificate", award: "Award", paper: "Publication", rank: "Ranking" } as const;
const years = ["2021", "2022", "2023", "2024", "2025"];

export function Education() {
  return (
    <section id="education" className="section education" aria-labelledby="education-title">
      <SectionHeader id="education-title" index="05" label="Education" title="Trained in AI, proven in practice." emphasis={[2]} note="Background" />

      <div className="edu__grid">
        <Reveal>
          <SpotlightCard className="degree">
            <Brackets />
            <span className="degree__icon">
              <Icon name="cap" size={26} />
            </span>
            <p className="mono dim">{education.period}</p>
            <h3 className="degree__title">{education.degree}</h3>
            <p className="degree__school">
              {education.school}, {education.city}
            </p>

            <div className="timeline" aria-hidden="true">
              <motion.span
                className="timeline__fill"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease }}
              />
              {years.map((y, i) => (
                <span key={y} className="timeline__tick" style={{ left: `${(i / (years.length - 1)) * 100}%` }}>
                  <i />
                  <span className="mono">{y}</span>
                </span>
              ))}
            </div>

            <p className="mono dim degree__sub">Relevant coursework</p>
            <div className="degree__chips">
              {education.coursework.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        <RevealGroup as="ul" className="creds" stagger={0.07}>
          {credentials.map((c) => (
            <RevealItem as="li" key={c.title} className={`cred cred--${c.kind}`}>
              <span className="cred__icon">
                <Icon name={c.icon} size={20} />
              </span>
              <div>
                <span className="cred__kind mono">{kindLabel[c.kind]}</span>
                <h3 className="cred__title">{c.title}</h3>
                <p className="cred__issuer">{c.issuer}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
