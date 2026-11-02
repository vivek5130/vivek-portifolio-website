"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { useCoarsePointer, useReducedMotion } from "@/lib/hooks";
import { ProjectSchematic } from "../ui/diagrams";
import { Icon } from "../ui/Icon";
import { ease } from "../ui/motion";
import { Brackets, Chip, SectionHeader } from "../ui/primitives";

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const coarse = useCoarsePointer();
  const reduced = useReducedMotion();
  const tiltable = !coarse && !reduced;
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    mx.set(x);
    my.set(y);
    e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const isSystem = p.code.startsWith("SYS");

  return (
    <motion.article
      className={`project project--${index}${isSystem ? " project--system" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay: (index % 3) * 0.08 }}
      style={tiltable ? { rotateX: rx, rotateY: ry, transformPerspective: 1100 } : undefined}
      onPointerMove={tiltable ? onMove : undefined}
      onPointerLeave={tiltable ? onLeave : undefined}
      aria-labelledby={`project-${p.id}`}
    >
      <Brackets />
      <div className="project__top mono">
        <span className={isSystem ? "project__code is-system" : "project__code"}>{p.code}</span>
        <span className="dim">{p.context}</span>
      </div>
      <div className="project__art">
        <ProjectSchematic kind={p.id} />
      </div>
      <h3 id={`project-${p.id}`} className="project__title">
        {p.title}
      </h3>
      <p className="project__tagline">{p.tagline}</p>
      <p className="project__desc">{p.description}</p>
      <div className="project__stack">
        {p.stack.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>
      <div className="project__foot">
        <span className="impact">
          <Icon name="bolt" size={13} />
          {p.outcome}
        </span>
        {p.href && (
          <a href={p.href} target="_blank" rel="noopener noreferrer" className="project__link">
            {p.hrefLabel}
            <Icon name="external" size={15} />
            <span className="sr-only"> for {p.title} (opens in new tab)</span>
          </a>
        )}
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <SectionHeader id="projects-title" index="03" label="Projects" title="Built for production. Driven by curiosity." emphasis={[2]} note="catalogue" />

      <p className="projects__legend mono">
        <span>
          <i className="legend-dot legend-dot--sys" /> SYS — Production Systems | Zithara.AI
        </span>
        <span>
          <i className="legend-dot" /> LAB — Independent Projects &amp; Research
        </span>
      </p>
      <div className="projects__grid">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} index={i} />
        ))}
      </div>
      <p className="projects__more">
        Explore more on{" "}
        <a href="https://github.com/vivek5130" target="_blank" rel="noopener noreferrer">
          GitHub <Icon name="external" size={14} />
        </a>
      </p>
    </section>
  );
}
