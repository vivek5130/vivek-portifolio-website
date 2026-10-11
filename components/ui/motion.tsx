"use client";

import { animate, motion, useInView, useMotionValue, useTransform, type Variants } from "framer-motion";
import { Fragment, useEffect, useRef } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
};

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section" | "header" | "p";
};

/** Fades + lifts content in once it scrolls into view. */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct <RevealItem> children. */
export function RevealGroup({ children, className, stagger = 0.08, as = "div" }: { children: React.ReactNode; className?: string; stagger?: number; as?: "div" | "ul" | "ol" }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={revealVariants}>
      {children}
    </Comp>
  );
}

/**
 * Word-by-word masked reveal for headlines.
 * Wrap emphasised words in <em> by passing `emphasis` indices.
 */
export function SplitText({ text, className, emphasis = [], delay = 0, as = "h2", id }: { text: string; className?: string; emphasis?: number[]; delay?: number; as?: "h1" | "h2" | "h3"; id?: string }) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
    >
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-mask" aria-hidden="true">
            <motion.span
              className={emphasis.includes(i) ? "split-word em" : "split-word"}
              variants={{ hidden: { y: "110%", rotate: 4 }, show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease } } }}
            >
              {w}
            </motion.span>
          </span>
          {/* Space lives outside the inline-block mask so it doesn't collapse. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Animated number that counts up when first visible. */
export function CountUp({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease });
    return () => controls.stop();
  }, [inView, mv, to, duration]);
  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      <motion.span aria-hidden="true">{rounded}</motion.span>
    </span>
  );
}
