"use client";

import Image from "next/image";
import { useRef } from "react";
import { education, experience, profile, type IconName } from "@/lib/data";
import { ReadAloud } from "../about/ReadAloud";
import { Terminal } from "../about/Terminal";
import { Icon } from "../ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "../ui/motion";
import { SectionHeader } from "../ui/primitives";

const pillars: { icon: IconName; title: string; body: string }[] = [
  { icon: "brain", title: "AI that ships", body: "LLM features that run in production for real customers — not demos that live in notebooks." },
  { icon: "layers", title: "Full-stack ownership", body: "From PostgreSQL schemas and Node services to React interfaces and AWS deployment." },
  { icon: "chart", title: "Measured impact", body: "Every system tied to a number: hours saved, engagement gained, handling time cut." },
];

export function About() {
  const copyRef = useRef<HTMLDivElement>(null);
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <SectionHeader id="about-title" index="01" label="About" title="Turning language into working software." emphasis={[3]} note="abstract" />

      <div className="about__grid">
        <div className="about__copy" ref={copyRef}>
          <Reveal>
            <div className="about__profile">
              <div className="about__avatar">
                <Image src="/vivek-portrait-hd.png" alt={`${profile.lastName} ${profile.firstName}`} width={1247} height={1261} sizes="96px" quality={90} />
              </div>
              <div>
                <p className="about__name">
                  {profile.lastName} {profile.firstName}
                </p>
                <p className="about__role">
                  {experience.role} @ {experience.company}
                </p>
                <p className="about__status mono">
                  <span className="live-dot" aria-hidden="true" />
                  Open to full-time roles
                </p>
              </div>
              <ReadAloud targetRef={copyRef} />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lead">
              Hi, I&apos;m {profile.lastName} — a <strong>Full Stack AI Engineer</strong> from <strong>{profile.location}</strong>, who enjoys turning messy, real-world problems into software people
              actually use.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="body-copy">
              Since May 2025 I&apos;ve been working at <strong>{experience.company}</strong>, an AI-first CRM for retail brands. I build the <strong>backend services, AI agents and
              automation</strong> behind it — conversational AI that resolves customer queries, reports generated from plain-English questions, and messaging and
              marketing workflows across WhatsApp, Instagram and email.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="body-copy">
              I graduated in 2025 with a <strong>B.Tech in Computer Science (AI &amp; ML)</strong> from {education.school}, {education.city}. Outside work I keep my
              fundamentals sharp with DSA — <strong>400+ problems on LeetCode</strong> — and I&apos;m always picking up something new.
            </p>
          </Reveal>
        </div>

        <Reveal className="about__console" delay={0.15}>
          <Terminal />
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
