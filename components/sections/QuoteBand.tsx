"use client";

import { useSyncExternalStore } from "react";
import { quotes } from "@/lib/data";
import { Reveal } from "../ui/motion";

// Two different quotes, picked once per page load in the browser and shared by every band.
let picks: number[] | null = null;
function getPicks() {
  if (!picks) {
    const order = quotes.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    picks = order;
  }
  return picks;
}
const serverPicks = quotes.map((_, i) => i);
const noop = () => () => {};

/**
 * A short line between sections. `slot` chooses which random pick to show, so bands on the
 * same page never repeat. The server renders the list in order; the browser swaps in the random
 * pick after hydration, so there's no mismatch.
 */
export function QuoteBand({ slot }: { slot: number }) {
  const order = useSyncExternalStore(noop, getPicks, () => serverPicks);
  const parts = quotes[order[slot % quotes.length]].split(/\*([^*]+)\*/);
  return (
    <Reveal className="quote">
      <figure>
        <blockquote className="quote__text">
          <p>
            <span className="quote__mark" aria-hidden="true">
              &ldquo;
            </span>
            {parts.map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
          </p>
        </blockquote>
      </figure>
    </Reveal>
  );
}
