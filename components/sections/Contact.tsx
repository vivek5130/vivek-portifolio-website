"use client";

import { useState } from "react";
import { profile, type IconName } from "@/lib/data";
import { useClock } from "@/lib/hooks";
import { Monogram } from "../chrome/Hud";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/motion";
import { Brackets, ButtonLink, SectionHeader, SpotlightCard } from "../ui/primitives";
import { scrollToId } from "@/lib/runtime";

const channels: { icon: IconName; label: string; value: string; href: string; external?: boolean }[] = [
  { icon: "mail", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: "phone", label: "Phone", value: profile.phone, href: profile.phoneHref },
  { icon: "linkedin", label: "LinkedIn", value: "in/vivekganathe", href: profile.links.linkedin, external: true },
  { icon: "github", label: "GitHub", value: "vivek5130", href: profile.links.github, external: true },
  { icon: "leetcode", label: "LeetCode", value: "u/vivek5130", href: profile.links.leetcode, external: true },
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

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <SectionHeader id="contact-title" index="06" label="Contact" title="Let's build something intelligent together." emphasis={[3]} note="Lets connect!" />

      <div className="contact__grid">
        <Reveal className="contact__left">
          <p className="lead">
            I&apos;m looking for full-time roles where AI meets real product work. If your team ships LLM features to real users, I&apos;d love to talk.
          </p>
          <ul className="channels">
            {channels.map((c) => (
              <li key={c.label}>
                <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className="channels__icon">
                    <Icon name={c.icon} size={18} />
                  </span>
                  <span className="channels__label mono">{c.label}</span>
                  <span className="channels__value">{c.value}</span>
                  <Icon name={c.external ? "external" : "arrow"} size={15} className="channels__go" />
                </a>
              </li>
            ))}
          </ul>
          <div className="contact__actions">
            <button type="button" className="btn btn--ghost" onClick={copy}>
              <span className="btn__label" aria-live="polite">
                {copied ? "Copied!" : "Copy email"}
              </span>
              <span className="btn__icon">
                <Icon name={copied ? "check" : "copy"} size={16} />
              </span>
            </button>
            <ButtonLink href={profile.resume} icon="download" download>
              Download résumé
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
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
