"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { metrics, profile, skillGroups } from "@/lib/data";
import { scrollToId } from "@/lib/runtime";
import { Icon } from "../ui/Icon";
import { CountUp, ease } from "../ui/motion";

const LEDE_LINES = [
  { focus: "AI-native", rest: " products — RAG pipelines, LLM agents and retrieval that ship." },
  { focus: "full-stack", rest: " apps — React, Next.js, Node and APIs that hold up in production." },
  { focus: "GenAI", rest: " end to end — from LangChain agents to the product UI around them." },
] as const;

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

/** Cycles AI / full-stack / GenAI lines with a typewriter. Always animates. */
function TypewriterLede() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  useEffect(() => {

    const line = LEDE_LINES[index];
    const full = `${line.focus}${line.rest}`;

    if (phase === "typing") {
      if (text.length >= full.length) {
        setPhase("pause");
        return;
      }
      const t = window.setTimeout(() => setText(full.slice(0, text.length + 1)), 28);
      return () => window.clearTimeout(t);
    }

    if (phase === "pause") {
      const t = window.setTimeout(() => setPhase("deleting"), 2200);
      return () => window.clearTimeout(t);
    }

    // deleting
    if (text.length === 0) {
      const t = window.setTimeout(() => {
        setIndex((i) => (i + 1) % LEDE_LINES.length);
        setPhase("typing");
      }, 180);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setText(text.slice(0, -1)), 16);
    return () => window.clearTimeout(t);
  }, [text, phase, index]);

  const focus = LEDE_LINES[index].focus;
  const focusLen = Math.min(text.length, focus.length);
  const typedFocus = text.slice(0, focusLen);
  const typedRest = text.slice(focusLen);

  return (
    <p className="hero__lede">
      <span className="sr-only">
        I build {LEDE_LINES.map((l) => `${l.focus}${l.rest}`).join(" ")}
      </span>
      <span aria-hidden="true">
        I build {typedFocus ? <em>{typedFocus}</em> : null}
        {typedRest}
        <span className="hero__caret" />
      </span>
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
            {ALL_SKILLS.map((s) => (
              <li className="marquee__item" key={s}>
                {s}
              </li>
            ))}
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
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7, ease }}>
            <span className="eyebrow__dot" aria-hidden="true" />
            {profile.role}
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
            <TypewriterLede />
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
              <a href={profile.resume} className="hero-btn hero-btn--outline" download>
                <Icon name="download" size={18} strokeWidth={2} />
                Download resume
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
          <div className="metric" key={m.label}>
            <dt className="mono dim">{m.source}</dt>
            <dd>
              <span className="metric__value">
                <CountUp to={m.value} suffix={m.suffix} />
              </span>
              <span className="metric__label">{m.label}</span>
            </dd>
          </div>
        ))}
      </motion.dl>

      <SkillsMarquee />
    </section>
  );
}
