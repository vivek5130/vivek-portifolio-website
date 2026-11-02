"use client";

import { useEffect, useRef, useState } from "react";
import { announceVoice } from "@/lib/audio";
import { Icon } from "../ui/Icon";

type State = "idle" | "playing" | "paused";

/** Pre-recorded reading of the About text. Regenerate it whenever that text changes. */
const SRC = "/audio/about_audio.mp3";

/**
 * Plays the recorded About narration. The file only downloads on the first click. While it plays,
 * the paragraph being read is highlighted, estimated from playback progress and each paragraph's
 * share of the text, and the background music dips.
 */
export function ReadAloud({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const reading = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<State>("idle");
  const [failed, setFailed] = useState(false);

  const mark = (el: HTMLElement | null) => {
    if (reading.current === el) return;
    reading.current?.classList.remove("is-reading");
    el?.classList.add("is-reading");
    reading.current = el;
  };

  /** Paragraph at this point of the recording, by cumulative share of characters. */
  const paragraphAt = (fraction: number) => {
    const paragraphs = [...(targetRef.current?.querySelectorAll<HTMLElement>("p.lead, p.body-copy") ?? [])];
    const total = paragraphs.reduce((n, p) => n + p.innerText.length, 0);
    let seen = 0;
    for (const p of paragraphs) {
      seen += p.innerText.length;
      if (fraction <= seen / total) return p;
    }
    return paragraphs.at(-1) ?? null;
  };

  const getAudio = () => {
    if (audio.current) return audio.current;
    const a = new Audio(SRC);
    a.preload = "auto";
    a.addEventListener("timeupdate", () => {
      // Only while playing: stop() rewinds to 0, which also fires timeupdate.
      if (a.duration && !a.paused) mark(paragraphAt(a.currentTime / a.duration));
    });
    a.addEventListener("ended", () => {
      mark(null);
      setState("idle");
      announceVoice(false);
    });
    a.addEventListener("error", () => {
      mark(null);
      setState("idle");
      setFailed(true);
      announceVoice(false);
    });
    audio.current = a;
    return a;
  };

  const stop = () => {
    const a = audio.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    mark(null);
    setState("idle");
    announceVoice(false);
  };

  const toggle = async () => {
    const a = getAudio();
    if (state === "playing") {
      a.pause();
      setState("paused");
      announceVoice(false);
      return;
    }
    try {
      await a.play();
      setState("playing");
      announceVoice(true);
    } catch {
      setState("idle");
    }
  };

  // Stop playback if the section unmounts.
  useEffect(
    () => () => {
      audio.current?.pause();
      announceVoice(false);
    },
    [],
  );

  if (failed) return null;

  return (
    <div className="read-aloud">
      <button
        type="button"
        className={`read-aloud__btn${state !== "idle" ? " is-active" : ""}`}
        onClick={toggle}
        aria-label={state === "playing" ? "Pause narration" : state === "paused" ? "Resume narration" : "Listen to this section"}
      >
        <Icon name={state === "playing" ? "pause" : "play"} size={13} strokeWidth={2} />
        {state === "playing" ? "Pause" : state === "paused" ? "Resume" : "Listen"}
        {state === "playing" && (
          <span className="read-aloud__bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </button>
      {state !== "idle" && (
        <button type="button" className="read-aloud__stop" onClick={stop} aria-label="Stop narration">
          <Icon name="stop" size={12} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
