"use client";

import { useEffect, useState } from "react";
import { consolePrompts, profile, type IconName } from "@/lib/data";
import { useReducedMotion } from "@/lib/hooks";
import { Icon } from "../ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "../ui/motion";
import { Brackets, SectionHeader, SpotlightCard } from "../ui/primitives";

const pillars: { icon: IconName; title: string; body: string }[] = [
  { icon: "brain", title: "AI that ships", body: "LLM features that run in production for real customers — not demos that live in notebooks." },
  { icon: "layers", title: "Full-stack ownership", body: "From PostgreSQL schemas and Node services to React interfaces and AWS deployment." },
  { icon: "chart", title: "Measured impact", body: "Every system tied to a number: hours saved, engagement gained, handling time cut." },
];

/** Streams text character-by-character, like a model response. */
function useStream(text: string, speed = 14) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [prevText, setPrevText] = useState(text);
  // Restart the stream when the question changes (render-phase reset).
  if (prevText !== text) {
    setPrevText(text);
    setCount(0);
  }
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) window.clearInterval(id);
        return Math.min(text.length, c + 2);
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, reduced]);
  return reduced ? text : text.slice(0, count);
}

function QueryConsole() {
  const [active, setActive] = useState(0);
  const answer = consolePrompts[active].a;
  const streamed = useStream(answer);
  const done = streamed.length >= answer.length;

  return (
    <SpotlightCard className="console">
      <Brackets />
      <div className="console__bar">
        <span className="console__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mono">vivek.query( )</span>
        <span className="mono dim">context: résumé · experience</span>
      </div>

      <div className="console__prompts" role="tablist" aria-label="Ask a question">
        {consolePrompts.map((p, i) => (
          <button
            key={p.q}
            role="tab"
            type="button"
            id={`q-${i}`}
            aria-selected={i === active}
            aria-controls="console-answer"
            className={i === active ? "is-active" : undefined}
            onClick={() => setActive(i)}
          >
            <Icon name="chat" size={14} />
            {p.q}
          </button>
        ))}
      </div>

      <div className="console__body" id="console-answer" role="tabpanel" aria-labelledby={`q-${active}`}>
        <p className="console__q mono">
          <span className="console__caret">&gt;</span> {consolePrompts[active].q}
        </p>
        {/* Full answer for assistive tech; animated copy is decorative. */}
        <p className="sr-only" aria-live="polite">
          {answer}
        </p>
        <p className="console__a" aria-hidden="true">
          {streamed}
          <span className={`cursor${done ? " is-idle" : ""}`} />
        </p>
      </div>
      <div className="console__foot mono">
        <span>
          <span className="live-dot" aria-hidden="true" />
        </span>
        <span className="dim">{done ? "complete" : "streaming…"}</span>
      </div>
    </SpotlightCard>
  );
}

export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <SectionHeader id="about-title" index="01" label="About" title="Turning language into working software." emphasis={[3]} note="abstract" />

      <div className="about__grid">
        <div className="about__copy">
          <Reveal>
            <p className="lead">{profile.summary}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-copy">
              {/* I graduated in Computer Science (AI &amp; ML) in 2025 and went straight into building GenAI products at Zithara.AI — an AI-first CRM for retail brands. I care about systems that are fast, observable and kind to the people using them.
               */}
              I graduated with a B.Tech in Computer Science (AI &amp; ML) in 2025 and began my professional journey at Zithara.AI, building Full Stack products for retail businesses. My work spans conversational AI, natural-language reporting, messaging and marketing automation, turning complex business needs into practical, reliable solutions.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="facts">
              <li>
                <Icon name="pin" size={16} />
                {profile.location}
              </li>
              <li>
                <Icon name="cap" size={16} />
                B.Tech CSE (AI &amp; ML), 2025
              </li>
              <li>
                <Icon name="target" size={16} />
                LeetCode top 10%
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal className="about__console" delay={0.15}>
          <QueryConsole />
        </Reveal>
      </div>

      <RevealGroup className="pillars">
        {pillars.map((p, i) => (
          <RevealItem key={p.title} className="pillar">
            <span className="pillar__num mono">0{i + 1}</span>
            <span className="pillar__icon">
              <Icon name={p.icon} size={22} />
            </span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
