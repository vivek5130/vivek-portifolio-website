"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { credentials, education, type Credential } from "@/lib/data";
import { Icon } from "../ui/Icon";
import { ease, Reveal, RevealGroup, RevealItem } from "../ui/motion";
import { Brackets, Chip, SectionHeader, SpotlightCard } from "../ui/primitives";

const kindLabel = { cert: "Certificate", award: "Award", paper: "Publication", rank: "Ranking" } as const;
const years = ["2021", "2022", "2023", "2024", "2025"];

const certificates = credentials.filter((c) => c.kind === "cert");
const achievements = credentials.filter((c) => c.kind !== "cert");

/** Icon, label, title, issuer and (when linked) a verify hint; the title link covers the whole card. */
function CredBody({ c }: { c: Credential }) {
  return (
    <>
      <span className="cred__icon">
        <Icon name={c.icon} size={20} />
      </span>
      <div>
        <span className="cred__kind mono">{kindLabel[c.kind]}</span>
        <h3 className="cred__title">
          {c.href ? (
            <a href={c.href} target="_blank" rel="noopener noreferrer" className="cred__link">
              {c.title}
              <span className="sr-only"> ({c.kind === "rank" ? "view profile" : "verify credential"}, opens in new tab)</span>
            </a>
          ) : (
            c.title
          )}
        </h3>
        <p className="cred__issuer">{c.issuer}</p>
        {c.href && (
          <span className="cred__verify mono" aria-hidden="true">
            {c.kind === "rank" ? "View profile" : "Verify"}
            <Icon name="external" size={11} />
          </span>
        )}
      </div>
    </>
  );
}

/** Horizontal, snap-scrolling row of certificates with previous / next buttons. */
function CertSlider() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  // Move by one card (plus the gap) per click.
  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 14), behavior: "smooth" });
  };

  return (
    <Reveal className="certs">
      <div className="certs__head">
        <h3 className="certs__title mono">
          Certifications <span className="dim">· {certificates.length}</span>
        </h3>
      </div>
      {/* Arrows sit over the left and right edges of the track; each hides when there's nothing further that way. */}
      <div className="certs__viewport">
        <button type="button" className="certs__btn certs__btn--prev" onClick={() => step(-1)} disabled={edges.start} aria-label="Previous certificates">
          <Icon name="arrow" size={16} className="rot-180" />
        </button>
        <ul
          className={`certs__track${edges.start ? "" : " has-prev"}${edges.end ? "" : " has-next"}`}
          ref={trackRef}
          onScroll={update}
          tabIndex={0}
          aria-label="Certifications, scroll horizontally"
        >
          {certificates.map((c) => (
            <li key={c.title} className={`cred cred--cert certs__card${c.href ? " cred--link" : ""}`}>
              <CredBody c={c} />
            </li>
          ))}
        </ul>
        <button type="button" className="certs__btn certs__btn--next" onClick={() => step(1)} disabled={edges.end} aria-label="Next certificates">
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </Reveal>
  );
}

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
          {achievements.map((c) => (
            <RevealItem as="li" key={c.title} className={`cred cred--${c.kind}${c.href ? " cred--link" : ""}`}>
              <CredBody c={c} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <CertSlider />
    </section>
  );
}
