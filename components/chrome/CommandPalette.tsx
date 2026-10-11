"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile, sections, type IconName } from "@/lib/data";
import { scrollToId } from "@/lib/runtime";
import { Icon } from "../ui/Icon";
import { ease } from "../ui/motion";

type Command = { id: string; label: string; hint: string; icon: IconName; run: () => void };

/** ⌘K / Ctrl+K palette for exploring the site like an IDE. */
export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(() => {
    const nav = sections.map<Command>((s) => ({ id: s.id, label: `Go to ${s.label}`, hint: s.index, icon: "arrow", run: () => scrollToId(s.id) }));
    return [
      ...nav,
      {
        id: "copy",
        label: "Copy email address",
        hint: profile.email,
        icon: "copy",
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          setToast("Email copied");
        },
      },
      { id: "resume", label: "Download résumé (PDF)", hint: "PDF", icon: "download", run: () => window.open(profile.resume, "_blank") },
      { id: "mail", label: "Write an email", hint: "mailto", icon: "mail", run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: "gh", label: "Open GitHub", hint: "vivek5130", icon: "github", run: () => window.open(profile.links.github, "_blank", "noopener") },
      { id: "li", label: "Open LinkedIn", hint: "vivekganathe", icon: "linkedin", run: () => window.open(profile.links.linkedin, "_blank", "noopener") },
      { id: "lc", label: "Open LeetCode", hint: "350+ solved", icon: "leetcode", run: () => window.open(profile.links.leetcode, "_blank", "noopener") },
    ];
  }, []);

  const filtered = commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Reset search each time the palette opens (render-phase reset).
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setIndex(0);
    }
  }

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => input.current?.focus());
    } else {
      returnFocus.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const run = (c?: Command) => {
    if (!c) return;
    setOpen(false);
    // Let the dialog close before scrolling so focus lands correctly.
    setTimeout(c.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") run(filtered[index]);
    else if (e.key === "Tab") e.preventDefault(); // keep focus inside the dialog
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="palette"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onKeyDown}
            >
              <div className="palette__input">
                <Icon name="search" size={18} />
                <input
                  ref={input}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                  }}
                  placeholder="Type a command or section…"
                  aria-label="Search commands"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
                  role="combobox"
                  aria-expanded="true"
                />
                <kbd>esc</kbd>
              </div>
              <ul id="palette-list" role="listbox" className="palette__list">
                {filtered.map((c, i) => (
                  <li
                    key={c.id}
                    id={`cmd-${c.id}`}
                    role="option"
                    aria-selected={i === index}
                    className={i === index ? "is-active" : undefined}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(c)}
                  >
                    <Icon name={c.icon} size={16} />
                    <span>{c.label}</span>
                    <span className="mono dim">{c.hint}</span>
                  </li>
                ))}
                {filtered.length === 0 && <li className="palette__empty">No matching command</li>}
              </ul>
              <div className="palette__foot mono">
                <span>↑↓ navigate</span>
                <span>↵ run</span>
                <span>⌘K toggle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="toast" role="status" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <Icon name="check" size={16} /> {toast}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
