"use client";

import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { consolePrompts, education, experience, profile, projects, skillGroups } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Output model: lines of styled segments, typed out char by char      */
/* ------------------------------------------------------------------ */

type Tone = "cyan" | "dim" | "text" | "err" | "ok" | "orange" | "head";
type Seg = { t: string; c?: Tone; href?: string; download?: boolean };
type Line = Seg[];
type Output = { blocks: Line[][]; prose?: boolean };
type Entry = Output & { id: number; cmd: string };
type Ctx = { history: string[]; args: string };
type Command = { name: string; usage?: string; desc: string; run: (ctx: Ctx) => Output | "clear" };

const s = (t: string, c?: Tone): Seg => ({ t, c });
const link = (t: string, href: string, c: Tone = "cyan"): Seg => ({ t, href, c });
const out = (...lines: Line[]): Output => ({ blocks: [lines] });
const blank: Line = [];

const LINK_RE = /(https?:\/\/[^\s]*[^\s.,]|[\w.+-]+@[\w-]+(?:\.\w+)+)/;
const IS_LINK = /^(https?:\/\/|[\w.+-]+@)/;

/** Plain text → one line of segments, with emails and URLs as links. */
function linkify(text: string): Line {
  return text
    .split(LINK_RE)
    .filter(Boolean)
    .map((part) => (IS_LINK.test(part) ? link(part, part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part) : s(part)));
}

function answer(i: number): Output {
  return { blocks: [[linkify(consolePrompts[i].a)]], prose: true };
}

const KEYWORDS: string[][] = [
  ["hire", "why", "choose", "fit", "value"],
  ["special", "strength", "best at", "good at", "expert", "focus"],
  ["team", "collab", "work with", "communicat", "people"],
  ["open", "job", "opportunit", "available", "relocat", "hiring", "notice"],
];

function matchQuestion(text: string) {
  const q = text.toLowerCase();
  const exact = consolePrompts.findIndex((p) => q.includes(p.q.toLowerCase().replace(/\?$/, "")));
  if (exact >= 0) return exact;
  let best = -1;
  let bestScore = 0;
  KEYWORDS.forEach((words, i) => {
    const score = words.filter((w) => q.includes(w)).length;
    if (score > bestScore) {
      best = i;
      bestScore = score;
    }
  });
  return best;
}

function yearsMonthsSince(iso: string) {
  const start = new Date(iso);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y}y`, m && `${m}m`].filter(Boolean).join(" ") || "0m";
}

const FILES: Record<string, string> = {
  "about.txt": "about",
  "skills.md": "skills",
  "experience.log": "experience",
  "projects/": "projects",
  "education.txt": "education",
  "contact.txt": "contact",
  "resume.pdf": "resume",
};

const LOGO = [" __     __ ____ ", " \\ \\   / // ___|", "  \\ \\ / /| |  _ ", "   \\ V / | |_| |", "    \\_/   \\____|"];

/* ------------------------------------------------------------------ */
/* Commands                                                            */
/* ------------------------------------------------------------------ */

const COMMANDS: Command[] = [
  {
    name: "help",
    desc: "List available commands",
    run: () =>
      out(
        [s("Available commands", "head")],
        blank,
        ...COMMANDS.map((c) => [s(`  /${(c.name + (c.usage ? ` ${c.usage}` : "")).padEnd(16)}`, "cyan"), s(c.desc, "dim")]),
        blank,
        [s("Tip: ", "orange"), s("type / for suggestions · Tab to complete · ↑↓ for history · Ctrl+L to clear", "dim")],
      ),
  },
  {
    name: "about",
    desc: "Who I am, in a few lines",
    run: () => ({ blocks: [[[s(profile.summary)]]], prose: true }),
  },
  {
    name: "whoami",
    desc: "One-line intro",
    run: () => out([s(`${profile.lastName} ${profile.firstName}`, "head"), s(` — ${profile.role} · ${profile.location}`)]),
  },
  {
    name: "skills",
    desc: "Tech stack, grouped",
    run: () =>
      out(
        ...skillGroups.flatMap((g, i) => [...(i ? [blank] : []), [s(`▸ ${g.label}`, "head")], [s(`  ${g.items.join(" · ")}`)]]),
      ),
  },
  {
    name: "experience",
    desc: "Where I work and what I've built",
    run: () =>
      out(
        [s(experience.role, "head"), s(" @ "), s(experience.company, "cyan")],
        [s(`${experience.period} · ${experience.location} · ${experience.context}`, "dim")],
        blank,
        ...experience.achievements.map((a): Line => [s("  ✓ ", "ok"), s(a.title), ...(a.impact ? [s(`  ${a.impact}`, "orange")] : [])]),
      ),
  },
  {
    name: "projects",
    usage: "[n]",
    desc: "Things I've shipped — add a number for details",
    run: ({ args }) => {
      const n = Number(args);
      const p = projects[n - 1];
      if (args && !p) return out([s(`projects: no project #${args} — pick 1–${projects.length}`, "err")]);
      if (p)
        return out(
          [s(`${p.code}  `, "orange"), s(p.title, "head")],
          [s(`${p.context}`, "dim")],
          blank,
          [s(p.description)],
          blank,
          [s("stack    ", "dim"), s(p.stack.join(", "))],
          [s("outcome  ", "dim"), s(p.outcome, "ok")],
          ...(p.href ? [[s("link     ", "dim"), link(p.hrefLabel ?? p.href, p.href)]] : []),
        );
      return out(
        ...projects.map((p, i): Line => [s(`  ${i + 1}  `, "cyan"), s(p.title.padEnd(28)), s(p.tagline, "dim")]),
        blank,
        [s("Run ", "dim"), s("/projects 2", "cyan"), s(" for details.", "dim")],
      );
    },
  },
  {
    name: "education",
    desc: "Degree and coursework",
    run: () =>
      out(
        [s(education.degree, "head")],
        [s(`${education.school}, ${education.city}`), s(` · ${education.period}`, "dim")],
        blank,
        [s("coursework  ", "dim"), s(education.coursework.join(" · "))],
      ),
  },
  {
    name: "contact",
    desc: "Email, phone and socials",
    run: () =>
      out(
        [s("email     ", "dim"), link(profile.email, `mailto:${profile.email}`)],
        [s("phone     ", "dim"), link(profile.phone, profile.phoneHref)],
        [s("linkedin  ", "dim"), link("linkedin.com/in/vivekganathe", profile.links.linkedin)],
        [s("github    ", "dim"), link("github.com/vivek5130", profile.links.github)],
        [s("leetcode  ", "dim"), link("leetcode.com/u/vivek5130", profile.links.leetcode)],
      ),
  },
  {
    name: "resume",
    desc: "Download my résumé (PDF)",
    run: () => out([s("↓ ", "ok"), { t: profile.resume.slice(1), c: "cyan", href: profile.resume, download: true }, s("  — click to download", "dim")]),
  },
  {
    name: "ask",
    usage: "[n|text]",
    desc: "Recruiter FAQ — why hire me, teamwork…",
    run: ({ args }) => {
      if (!args)
        return out(
          ...consolePrompts.map((p, i): Line => [s(`  ${i + 1}  `, "cyan"), s(p.q)]),
          blank,
          [s("Run ", "dim"), s("/ask 1", "cyan"), s(" or just type your question.", "dim")],
        );
      const n = Number(args);
      const i = Number.isInteger(n) && n >= 1 && n <= consolePrompts.length ? n - 1 : matchQuestion(args);
      return i >= 0 ? answer(i) : out([s(`ask: no answer for "${args}" — try /ask to see the questions`, "err")]);
    },
  },
  {
    name: "neofetch",
    desc: "System info, the fun way",
    run: () => ({
      blocks: [
        LOGO.map((l) => [s(l, "cyan")]),
        [
          [s("guest", "cyan"), s("@"), s("vivek", "cyan")],
          [s("──────────────", "dim")],
          [s("role     ", "orange"), s(profile.role)],
          [s("work     ", "orange"), s(`SDE @ ${experience.company}`)],
          [s("uptime   ", "orange"), s(`${yearsMonthsSince(experience.start)} in industry`)],
          [s("location ", "orange"), s(profile.location)],
          [s("stack    ", "orange"), s("TS · Python · LangChain · AWS")],
          [s("status   ", "orange"), s("open to full-time roles", "ok")],
        ],
      ],
    }),
  },
  { name: "ls", desc: "List files", run: () => out(Object.keys(FILES).map((f) => s(`${f}  `, f.endsWith("/") ? "cyan" : "text"))) },
  {
    name: "cat",
    usage: "<file>",
    desc: "Print a file",
    run: (ctx) => {
      const target = FILES[ctx.args];
      if (!ctx.args) return out([s("usage: cat <file> — try ", "dim"), s("ls", "cyan")]);
      if (!target) return out([s(`cat: ${ctx.args}: No such file or directory`, "err")]);
      return COMMANDS.find((c) => c.name === target)!.run({ ...ctx, args: "" });
    },
  },
  { name: "history", desc: "Commands you've run", run: ({ history }) => out(...history.map((h, i): Line => [s(`  ${String(i + 1).padStart(3)}  `, "dim"), s(h)])) },
  { name: "date", desc: "Current date and time", run: () => out([s(new Date().toString().replace(/\s\(.*\)$/, ""))]) },
  { name: "echo", usage: "<text>", desc: "Print text", run: ({ args }) => out([s(args)]) },
  { name: "clear", desc: "Clear the screen", run: () => "clear" },
];

const ALIASES: Record<string, string> = { cls: "clear", "?": "help", man: "help", fetch: "neofetch", cv: "resume", work: "experience", exp: "experience", email: "contact" };

function execute(raw: string, history: string[]): Output | "clear" {
  const input = raw.trim().replace(/^\//, "");
  const [head, ...rest] = input.split(/\s+/);
  const args = rest.join(" ");
  const name = ALIASES[head.toLowerCase()] ?? head.toLowerCase();

  if (name === "sudo")
    return out(
      [s("[sudo] password for guest: ********", "dim")],
      [s("Permission granted. ", "ok"), s("Fastest way to hire me: ")],
      [link(profile.email, `mailto:${profile.email}`)],
    );
  if (name === "cd") return out([s("cd: this portfolio is read-only — try ", "dim"), s("ls", "cyan")]);
  if (name === "exit") return out([s("There's no exit — but you can ", "dim"), s("/contact", "cyan"), s(" me.", "dim")]);
  if (["vim", "nano", "code"].includes(name)) return out([s(`${name}: no editing on prod — try `, "dim"), s("/help", "cyan")]);

  const cmd = COMMANDS.find((c) => c.name === name);
  if (cmd) return cmd.run({ history, args });

  const q = matchQuestion(input);
  if (q >= 0) return answer(q);

  return out([s(`command not found: ${head}`, "err")], [s("Type ", "dim"), s("/help", "cyan"), s(" to see what you can run.", "dim")]);
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const lineLen = (l: Line) => l.reduce((n, seg) => n + seg.t.length, 0) + 1;
const outputLen = (o: Output) => o.blocks.reduce((n, b) => n + b.reduce((m, l) => m + lineLen(l), 0), 0);
const plain = (o: Output) => o.blocks.map((b) => b.map((l) => l.map((seg) => seg.t).join("")).join("\n")).join("\n");

/** One line, cut to the characters typed so far (`shown`), with the cursor if typing stopped here. */
function TypedLine({ line, shown, cursor }: { line: Line; shown: number; cursor: boolean }) {
  const starts = line.map((_, i) => line.slice(0, i).reduce((n, seg) => n + seg.t.length, 0));
  return (
    <div className="term__row">
      {line.map((seg, i) => {
        if (starts[i] >= shown) return null;
        const t = seg.t.slice(0, shown - starts[i]);
        const cls = seg.c ? `tc-${seg.c}` : undefined;
        return seg.href ? (
          <a
            key={i}
            href={seg.href}
            className={`term__link ${cls ?? ""}`}
            {...(seg.download ? { download: "" } : {})}
            {...(seg.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {t}
          </a>
        ) : (
          <span key={i} className={cls}>
            {t}
          </span>
        );
      })}
      {cursor && <span className="term__cursor" />}
    </div>
  );
}

/** Renders the first `limit` characters of an output, block by block. */
function Typed({ entry, limit }: { entry: Entry; limit: number }) {
  const lines = entry.blocks.flatMap((b, bi) => b.map((line) => ({ bi, line })));
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + lineLen(l.line), 0));
  const done = limit >= outputLen(entry);
  const cls = `term__out${entry.prose ? " term__out--prose" : ""}${entry.blocks.length > 1 ? " term__out--cols" : ""}`;

  return (
    <div className={cls}>
      {entry.blocks.map((_, bi) => (
        <div key={bi}>
          {lines.map(({ bi: owner, line }, i) => {
            if (owner !== bi || starts[i] >= limit) return null;
            const end = starts[i] + lineLen(line);
            return <TypedLine key={i} line={line} shown={limit - starts[i]} cursor={!done && limit <= end} />;
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Terminal                                                            */
/* ------------------------------------------------------------------ */

const CMD_SPEED = 30;
const QUICK = ["help", "skills", "experience", "projects", "contact", "ask"];

export function Terminal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<HTMLUListElement>(null);
  const nextId = useRef(0);
  const inView = useInView(rootRef, { once: true, amount: 0.4 });

  const [entries, setEntries] = useState<Entry[]>([]);
  const [progress, setProgress] = useState({ cmd: 0, out: 0 });
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [booted, setBooted] = useState(false);

  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const last = entries[entries.length - 1];
  const lastLen = last ? outputLen(last) : 0;
  const typing = !!last && (progress.cmd < last.cmd.length || progress.out < lastLen);

  // Slash-command suggestions, shown while the first word is still being typed.
  const suggestions = useMemo(() => {
    if (!input.startsWith("/") || input.includes(" ")) return [];
    const q = input.slice(1).toLowerCase();
    return COMMANDS.filter((c) => c.name.startsWith(q));
  }, [input]);
  const sel = Math.min(selected, Math.max(0, suggestions.length - 1));

  function run(cmd: string, { typed = false }: { typed?: boolean } = {}) {
    const nextHistory = [...history, cmd];
    setHistory(nextHistory);
    setHistoryIdx(null);
    const result = execute(cmd, nextHistory);
    if (result === "clear") {
      setEntries([]);
      return;
    }
    setEntries((list) => [...list.slice(-8), { id: nextId.current++, cmd, ...result }]);
    // Commands the visitor typed appear instantly; clicked ones are typed out first.
    setProgress({ cmd: typed ? cmd.length : 0, out: 0 });
  }

  function skip() {
    if (last) setProgress({ cmd: last.cmd.length, out: lastLen });
  }

  function complete(c: Command) {
    setInput(`/${c.name}${c.usage ? " " : ""}`);
    setSelected(0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      if (window.getSelection()?.toString()) return;
      e.preventDefault();
      skip();
      setInput("");
      return;
    }

    if (suggestions.length) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const d = e.key === "ArrowDown" ? 1 : -1;
        const n = suggestions.length;
        setSelected((i) => (Math.min(i, n - 1) + d + n) % n);
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        complete(suggestions[sel]);
        return;
      }
      if (e.key === "Escape") {
        setInput("");
        return;
      }
      if (e.key === "Enter") {
        const c = suggestions[sel];
        // Commands that take arguments complete first; the rest run straight away.
        if (c.usage && input !== `/${c.name}`) {
          e.preventDefault();
          complete(c);
          return;
        }
        e.preventDefault();
        run(`/${c.name}`, { typed: true });
        setInput("");
        return;
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const word = input.trim().toLowerCase();
      const match = word && COMMANDS.find((c) => c.name.startsWith(word));
      if (match) complete(match);
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      const up = e.key === "ArrowUp";
      const idx = historyIdx === null ? (up ? history.length - 1 : null) : up ? Math.max(0, historyIdx - 1) : historyIdx + 1;
      if (idx === null || idx >= history.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    }
  }

  // Boot with neofetch once the terminal scrolls into view.
  useEffect(() => {
    if (!inView || booted) return;
    const t = window.setTimeout(() => {
      setBooted(true);
      run("neofetch");
    }, 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, booted]);

  // Typewriter: the command first, then its output. Advances by elapsed time so a busy main thread doesn't slow it down.
  useEffect(() => {
    if (!last || !typing) return;
    // Long listings type faster so nothing takes more than a few seconds.
    const outSpeed = Math.min(12, (last.prose ? 5000 : 1400) / lastLen);
    let prev = performance.now();
    let carry = 0;
    const id = window.setInterval(() => {
      const now = performance.now();
      carry += now - prev;
      prev = now;
      const p = progressRef.current;
      const onCmd = p.cmd < last.cmd.length;
      const speed = onCmd ? CMD_SPEED : outSpeed;
      const n = Math.floor(carry / speed);
      if (!n) return;
      carry -= n * speed;
      setProgress(onCmd ? { ...p, cmd: Math.min(last.cmd.length, p.cmd + n) } : { ...p, out: Math.min(lastLen, p.out + n) });
    }, 16);
    return () => window.clearInterval(id);
  }, [last, lastLen, typing]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [progress, entries, suggestions.length]);

  // Keep the highlighted suggestion visible inside the list without scrolling the page.
  useEffect(() => {
    const list = suggestRef.current;
    const item = list?.children[sel] as HTMLElement | undefined;
    if (!list || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop - 4;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight + 4;
  }, [sel, suggestions.length]);

  const lastName = last?.cmd.replace(/^\//, "").split(" ")[0];

  return (
    <div className="term" ref={rootRef}>
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title mono">guest@vivek: ~</span>
        <span className="term__status mono">
          <span className={`term__led${typing ? " is-busy" : ""}`} aria-hidden="true" />
          {typing ? "running" : "ready"}
        </span>
      </div>

      <div
        className="term__body"
        ref={bodyRef}
        data-lenis-prevent
        onClick={() => {
          if (typing) skip();
          else if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
        }}
      >
        <p className="term__row tc-dim">Welcome! Type / to see commands, or try /help.</p>

        {entries.map((e, i) => {
          const isLast = i === entries.length - 1;
          const cmdShown = isLast ? e.cmd.slice(0, progress.cmd) : e.cmd;
          const cmdDone = !isLast || progress.cmd >= e.cmd.length;
          return (
            <div className="term__entry" key={e.id}>
              <p className="term__row">
                <span className="term__prompt">❯</span> <span className="term__cmd">{cmdShown}</span>
                {isLast && !cmdDone && <span className="term__cursor" />}
              </p>
              {cmdDone && <Typed entry={e} limit={isLast ? progress.out : Infinity} />}
            </div>
          );
        })}

        <form
          className="term__input"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) {
              if (typing) skip();
              return;
            }
            run(input.trim(), { typed: true });
            setInput("");
          }}
        >
          <span className="term__prompt" aria-hidden="true">
            ❯
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-label="Terminal command"
            aria-autocomplete="list"
            aria-controls="term-suggest"
            aria-expanded={suggestions.length > 0}
            placeholder={typing ? "press enter to skip" : "type / for commands"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>

        {suggestions.length > 0 && (
          <ul className="term__suggest" id="term-suggest" role="listbox" aria-label="Commands" ref={suggestRef} data-lenis-prevent>
            {suggestions.map((c, i) => (
              <li key={c.name} role="option" aria-selected={i === sel}>
                <button
                  type="button"
                  className={i === sel ? "is-active" : undefined}
                  onMouseEnter={() => setSelected(i)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (c.usage) complete(c);
                    else {
                      run(`/${c.name}`, { typed: true });
                      setInput("");
                    }
                    inputRef.current?.focus({ preventScroll: true });
                  }}
                >
                  <span className="term__suggest-name">
                    /{c.name}
                    {c.usage && <span className="tc-dim"> {c.usage}</span>}
                  </span>
                  <span className="term__suggest-desc">{c.desc}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Full output for assistive tech; the typed copy above is decorative. */}
      <p className="sr-only" aria-live="polite">
        {last && !typing ? plain(last) : ""}
      </p>

      <div className="term__chips" role="group" aria-label="Quick commands">
        {QUICK.map((name) => (
          <button key={name} type="button" className={name === lastName ? "is-active" : undefined} onClick={() => run(`/${name}`)}>
            /{name}
          </button>
        ))}
      </div>
    </div>
  );
}
