"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { experience, metrics, profile, skillGroups } from "@/lib/data";
import { scrollToId } from "@/lib/runtime";
import { brandColor, brandForSkill, brandIcons } from "@/lib/techIcons";
import { Icon } from "../ui/Icon";
import { ease } from "../ui/motion";

/** Simple fade-up for each name line — always animates for dramatic effect. */
function RevealName({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.75, ease }}
    >
      {text}
    </motion.span>
  );
}

/** One static sentence: role first, then what you build. */
function Lede() {
  return (
    <p className="hero__lede">
      <strong>{profile.role}</strong> — I build <em>AI agents and full-stack products</em> that ship to production.
    </p>
  );
}

const SOCIALS = [
  { label: "GitHub", href: profile.links.github, icon: "github" },
  { label: "LinkedIn", href: profile.links.linkedin, icon: "linkedin" },
  { label: "LeetCode", href: profile.links.leetcode, icon: "leetcode" },
  { label: `Email ${profile.email}`, href: `mailto:${profile.email}`, icon: "mail" },
] as const;

const ALL_SKILLS = skillGroups.flatMap((g) => g.items);

/** Infinite horizontal ticker of every skill; the list is doubled so the loop is seamless. */
function SkillsMarquee() {
  return (
    <motion.div className="marquee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6, ease }}>
      <ul className="sr-only">
        {ALL_SKILLS.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <ul className="marquee__group" key={copy}>
            {ALL_SKILLS.map((s) => {
              const brand = brandForSkill(s);
              return (
                <li className="marquee__item" key={s}>
                  {brand ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill={brandColor(brandIcons[brand].hex)} aria-hidden="true">
                      <path d={brandIcons[brand].path} />
                    </svg>
                  ) : (
                    <span className="marquee__dot" />
                  )}
                  {s}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section id="hero" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero__grid-lines" aria-hidden="true" />

      <motion.div className="hero__copy" style={{ y: nameY, opacity: fade }}>
        <div className="hero__intro">
          <motion.p className="hero__badge" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7, ease }}>
            <span className="hero__badge-open">
              <span className="live-dot" aria-hidden="true" />
              Open to full-time roles
            </span>
            <span className="hero__badge-sep" aria-hidden="true" />
            <span className="hero__badge-work">
              <span className="hero__badge-logo">
                <Image src="/zithara_logo.png" alt="" width={4500} height={4500} sizes="32px" />
              </span>
              SDE @ {experience.company}
            </span>
          </motion.p>

          <h1 id="hero-title" className="hero__name">
            <span className="sr-only">
              {profile.lastName} {profile.firstName}, {profile.role}
            </span>
            <RevealName text={profile.lastName} className="hero__name-line hero__name-line--accent" delay={0.1} />
            <RevealName text={profile.firstName} className="hero__name-line hero__name-line--first" delay={0.22} />
          </h1>
        </div>

        <div className="hero__details">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.65, ease }}>
            <Lede />
          </motion.div>

          <motion.div className="hero__actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.55, ease }}>
            <div className="hero__cta">
              <a
                href="#experience"
                className="hero-btn hero-btn--solid"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("experience");
                }}
              >
                Explore my work
                <Icon name="arrow" size={18} strokeWidth={2} />
              </a>
              <a href={profile.resume} className="hero-btn hero-btn--outline" target="_blank" rel="noopener noreferrer">
                <Icon name="paper" size={18} strokeWidth={2} />
                View resume
                <span className="sr-only"> (PDF, opens in a new tab)</span>
              </a>
            </div>

            <ul className="hero__socials" aria-label="Find me online">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="hero-social"
                    aria-label={s.label}
                    title={s.label}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon name={s.icon} size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      <motion.dl className="hero__metrics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6, ease }}>
        {metrics.map((m) => (
          <div className="metric" key={m.label} title={m.source}>
            <dt className="sr-only">{m.source}</dt>
            <dd>
              <span className="metric__value">{m.value}</span>
              <span className="metric__label">{m.label}</span>
            </dd>
          </div>
        ))}
      </motion.dl>

      <SkillsMarquee />

      <a
        href="#about"
        className="hero__scroll"
        aria-label="Scroll to About"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("about");
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
