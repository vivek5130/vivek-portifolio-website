"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { profile, sections } from "@/lib/data";
import { useActiveSection, useClock } from "@/lib/hooks";
import { scrollToId } from "@/lib/runtime";
import { Icon } from "../ui/Icon";
import { ease } from "../ui/motion";

const ids = sections.map((s) => s.id);

export function Monogram({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="monogram">
      <path d="M12 18l9 28 9-28" />
      <path d="M52 22a12 12 0 1 0 0 20v-8h-7" />
      <circle cx="31" cy="12" r="3" className="monogram__dot" />
    </svg>
  );
}

function go(e: React.MouseEvent, id: string, after?: () => void) {
  e.preventDefault();
  after?.();
  scrollToId(id);
}

/** Top navigation bar styled as an instrument HUD. */
export function Hud({ onOpenPalette }: { onOpenPalette: () => void }) {
  const active = useActiveSection(ids);
  const time = useClock("Asia/Kolkata");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`hud${scrolled ? " is-scrolled" : ""}`}>
      <div className="hud__bar">
        <a href="#hero" className="hud__brand" onClick={(e) => go(e, "hero")} aria-label="Back to top">
          <Monogram />
          <span className="hud__brand-text">
            <strong>Vivek</strong>
            <span className="mono dim">AI · Full Stack</span>
          </span>
        </a>

        <nav className="hud__nav" aria-label="Sections">
          {sections.slice(1).map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => go(e, s.id)}
              className={active === s.id ? "is-active" : undefined}
              aria-current={active === s.id ? "true" : undefined}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="hud__actions">
          <span className="hud__clock mono" aria-label={`Local time in Hyderabad ${time}`}>
            <span className="live-dot" aria-hidden="true" /> HYD {time}
          </span>
          <button type="button" className="hud__cmd" onClick={onOpenPalette} aria-label="Open command palette">
            <Icon name="command" size={14} />
            <span className="mono">K</span>
          </button>
          <a href={`mailto:${profile.email}`} className="btn btn--primary btn--sm hud__hire">
            <span className="btn__label">Hire me</span>
          </a>
          <button
            type="button"
            className="hud__menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>
      <motion.div className="hud__progress" style={{ scaleX: progress }} aria-hidden="true" />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Sections"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease }}
          >
            {sections.map((s, i) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id, () => setOpen(false))}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.4, ease }}
                className={active === s.id ? "is-active" : undefined}
              >
                {s.label}
              </motion.a>
            ))}
            <a href={profile.resume} download className="btn btn--ghost">
              <span className="btn__label">Download résumé</span>
              <span className="btn__icon">
                <Icon name="download" size={16} />
              </span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Vertical index rail on the right edge (desktop). */
export function SectionRail() {
  const active = useActiveSection(ids);
  return (
    <nav className="rail" aria-label="Section index">
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`} onClick={(e) => go(e, s.id)} className={active === s.id ? "is-active" : undefined} aria-label={s.label}>
          <span className="rail__label">{s.label}</span>
          <span className="rail__tick" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
