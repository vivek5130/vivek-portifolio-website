"use client";

import { useState } from "react";
import { profile, type IconName } from "@/lib/data";
import { useClock } from "@/lib/hooks";
import { Monogram } from "../chrome/Hud";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/motion";
import { Brackets, SectionHeader, SpotlightCard } from "../ui/primitives";
import { scrollToId } from "@/lib/runtime";

const profiles: { icon: IconName; label: string; href: string }[] = [
  { icon: "linkedin", label: "LinkedIn", href: profile.links.linkedin },
  { icon: "github", label: "GitHub", href: profile.links.github },
  { icon: "leetcode", label: "LeetCode", href: profile.links.leetcode },
];

function ComposeForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Opportunity for Vivek${company ? ` — ${company}` : ""}`;
    const body = `${message}\n\n— ${name}${company ? `, ${company}` : ""}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="compose" onSubmit={onSubmit}>
      <div className="compose__row">
        <label>
          <span className="mono">your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Alex" />
        </label>
        <label>
          <span className="mono">Subject</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" placeholder="" />
        </label>
      </div>
      <label>
        <span className="mono">message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} placeholder="We're hiring for an AI engineer who can…" />
      </label>
      {/* align button to center */}
      <div className="compose__foot text-center">
        {/* <p className="dim">Opens your email app with this message pre-filled.</p> */}
        <button type="submit" className="btn btn--primary mx-auto"> Compose email </button>
      </div>
    </form>
  );
}

/** Copies `text`; shows a tick for a moment. If the clipboard is unavailable, opens `fallbackHref` instead. */
function CopyButton({ text, label, fallbackHref }: { text: string; label: string; fallbackHref: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = fallbackHref;
    }
  };
  return (
    <button type="button" className="reach__copy" onClick={copy} aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`} title={copied ? "Copied" : "Copy"}>
      <Icon name={copied ? "check" : "copy"} size={14} />
    </button>
  );
}

export function Contact() {

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <SectionHeader id="contact-title" index="06" label="Contact" title="Let's build something intelligent together." emphasis={[3]} note="Lets connect!" />

      <div className="contact__grid">
        <Reveal className="contact__left">
          <p className="contact__status">
            <span className="live-dot" aria-hidden="true" />
            Open to full-time roles <span className="dim">·</span> {profile.location} <span className="dim">·</span> Open to relocate
          </p>
          <p className="contact__intro">
            I&apos;m looking for full-time roles in full-stack development and AI engineering. If you&apos;re building something exciting, I&apos;d love to hear about
            it.
          </p>

          {/* Direct ways to reach me: two matching tiles, each clickable as a whole */}
          <div className="reach">
            <div className="reach__tile">
              <span className="reach__icon">
                <Icon name="mail" size={17} />
              </span>
              <a href={`mailto:${profile.email}`} className="reach__link">
                <span className="reach__label mono">Email</span>
                <span className="reach__value">{profile.email}</span>
              </a>
              <CopyButton text={profile.email} label="Email address" fallbackHref={`mailto:${profile.email}`} />
            </div>
            <div className="reach__tile">
              <span className="reach__icon">
                <Icon name="phone" size={17} />
              </span>
              <a href={profile.phoneHref} className="reach__link">
                <span className="reach__label mono">Phone</span>
                <span className="reach__value">{profile.phone}</span>
              </a>
              <CopyButton text={profile.phone} label="Phone number" fallbackHref={profile.phoneHref} />
            </div>
          </div>

          <div className="links">
            {profiles.map((p) => (
              <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="links__pill">
                <Icon name={p.icon} size={15} />
                {p.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ))}
          </div>

          <a href={profile.resume} download className="contact__resume">
            <Icon name="download" size={16} strokeWidth={2} />
            Download resume
          </a>
        </Reveal>

        <Reveal delay={0.12} className="contact__right">
          <SpotlightCard className="compose-card">
            <Brackets />
            <p className="mono compose-card__title">
              <Icon name="mail" size={14} /> new_message.eml
            </p>
            <ComposeForm />
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const time = useClock("Asia/Kolkata");
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Monogram size={28} />
        <span>
          {profile.firstName} {profile.lastName}
        </span>
      </div>
      <p className="footer__meta mono">
        Designed &amp; engineered by Vivek · Next.js · Three.js · R3F
        <span className="dim"> · Hyderabad {time} IST</span>
      </p>
      <div className="footer__links">
        <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Icon name="github" size={18} />
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <Icon name="linkedin" size={18} />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email">
          <Icon name="mail" size={18} />
        </a>
        <button type="button" onClick={() => scrollToId("hero")} className="footer__top">
          <span className="mono">top</span>
          <Icon name="arrow" size={14} className="rot-up" />
        </button>
      </div>
    </footer>
  );
}
