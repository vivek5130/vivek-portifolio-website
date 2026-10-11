"use client";

import { useRef } from "react";
import type { IconName } from "@/lib/data";
import { Icon } from "./Icon";
import { SplitText } from "./motion";

/** Editorial section header: index, label, rule and an animated headline. */
export function SectionHeader({
  index,
  label,
  title,
  emphasis,
  note,
  id,
}: {
  index: string;
  label: string;
  title: string;
  emphasis?: number[];
  note?: string;
  id: string;
}) {
  return (
    <header className="section-head">
      <div className="section-head__meta">
        <span className="section-head__index">[{index}]</span>
        <span className="section-head__label">{label}</span>
        <span className="section-head__rule" aria-hidden="true" />
        {note && <span className="section-head__note">{note}</span>}
      </div>
      <SplitText as="h2" id={id} text={title} emphasis={emphasis} className="section-head__title" />
    </header>
  );
}

/** Panel whose border and glow follow the pointer. */
export function SpotlightCard({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "article" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag ref={ref as never} className={`spot ${className}`} onPointerMove={onMove}>
      {children}
    </Tag>
  );
}

export function Chip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "hot" | "cyan" }) {
  return <span className={`chip chip--${tone}`}>{children}</span>;
}

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: IconName;
  variant?: "primary" | "ghost";
  external?: boolean;
  download?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function ButtonLink({ href, children, icon = "arrow", variant = "primary", external, download, onClick }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`btn btn--${variant}`}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
    >
      <span className="btn__label">{children}</span>
      <span className="btn__icon">
        <Icon name={icon} size={16} />
      </span>
    </a>
  );
}

/** Small corner brackets that frame a panel like a viewfinder. */
export function Brackets() {
  return (
    <span className="brackets" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
