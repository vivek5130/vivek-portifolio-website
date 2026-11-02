"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { metrics, profile } from "@/lib/data";
import { scrollToId } from "@/lib/runtime";
import { Icon } from "../ui/Icon";
import { CountUp, ease } from "../ui/motion";
import { ButtonLink } from "../ui/primitives";
import { Portrait } from "../hero/Portrait";

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

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
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
              {profile.firstName} {profile.lastName}, {profile.role}
            </span>
            <RevealName text={profile.firstName} className="hero__name-line hero__name-line--first" delay={0.1} />
            <RevealName text={profile.lastName} className="hero__name-line hero__name-line--accent" delay={0.22} />
          </h1>
        </div>

        <div className="hero__details">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.65, ease }}>
            <TypewriterLede />
          </motion.div>


          <motion.div className="hero__cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.55, ease }}>
            <ButtonLink
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("experience");
              }}
            >
              Explore the work
            </ButtonLink>
            <ButtonLink href={profile.resume} variant="ghost" icon="download" download>
              Resume.pdf
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="hero__portrait" style={{ y: portraitY }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8, ease }}>
        <Portrait />
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

      <a
        href="#about"
        className="scroll-cue"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("about");
        }}
      >
        <span className="mono">scroll</span>
        <span className="scroll-cue__line" aria-hidden="true" />
      </a>
    </section>
  );
}
