"use client";

import { useEffect, useRef, useState } from "react";
import { VOICE_EVENT } from "@/lib/audio";
import { Icon } from "../ui/Icon";
import { DEFAULT_PRESET, PRESETS, type PresetId } from "./ambientPresets";

const VOLUME = 0.09;
const DUCKED = 0.025; // while the read-aloud voice is speaking
const STORAGE_KEY = "ambient-track";

/** Owns the audio context and the currently playing preset; switching crossfades between presets. */
class AmbientEngine {
  private ctx = new AudioContext();
  private master = this.ctx.createGain();
  private current: { id: PresetId; stop: () => void } | null = null;

  constructor() {
    this.master.gain.value = VOLUME;
    this.master.connect(this.ctx.destination);
  }

  async play(id: PresetId) {
    await this.ctx.resume();
    if (this.current?.id === id) return;
    this.current?.stop();
    const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0];
    this.current = { id, stop: preset.start(this.ctx, this.master) };
  }

  pause() {
    this.current?.stop();
    this.current = null;
    window.setTimeout(() => {
      if (!this.current) this.ctx.suspend();
    }, 1600);
  }

  duck(on: boolean) {
    this.master.gain.setTargetAtTime(on ? DUCKED : VOLUME, this.ctx.currentTime, 0.3);
  }
}

function storedTrack(): PresetId {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (PRESETS.some((p) => p.id === saved)) return saved as PresetId;
  } catch {
    // Storage can be blocked (private mode); fall back to the default.
  }
  return DEFAULT_PRESET;
}

/** Header "Music" button with a small library: pick one of five generated tracks, play or pause. */
export function AmbientMusic() {
  const engine = useRef<AmbientEngine | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<PresetId>(DEFAULT_PRESET);

  // Audio may only start from a click, so the engine is created on first use.
  const play = async (id: PresetId) => {
    engine.current ??= new AmbientEngine();
    await engine.current.play(id);
    setTrack(id);
    setPlaying(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Not remembering the choice is fine.
    }
  };

  const pause = () => {
    engine.current?.pause();
    setPlaying(false);
  };

  const togglePlay = () => (playing ? pause() : play(track));
  const choose = (id: PresetId) => (playing && id === track ? pause() : play(id));

  const toggleMenu = () => {
    if (!open && !playing) setTrack(storedTrack());
    setOpen((o) => !o);
  };

  // Close the menu on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Dip the music while the read-aloud voice is speaking.
  useEffect(() => {
    if (!playing) return;
    const onVoice = (e: Event) => engine.current?.duck((e as CustomEvent<{ speaking: boolean }>).detail.speaking);
    window.addEventListener(VOICE_EVENT, onVoice);
    return () => window.removeEventListener(VOICE_EVENT, onVoice);
  }, [playing]);

  useEffect(() => () => engine.current?.pause(), []);

  const current = PRESETS.find((p) => p.id === track) ?? PRESETS[0];

  return (
    <div className="ambient-wrap" ref={root}>
      <button
        type="button"
        className={`ambient${playing ? " is-on" : ""}${open ? " is-open" : ""}`}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={playing ? `Music: ${current.name} playing. Open music menu` : "Open background music menu"}
      >
        <Icon name="music" size={14} />
        <span className="ambient__bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="ambient__label">Music</span>
      </button>

      {open && (
        <div className="ambient-menu" role="menu" aria-label="Background music">
          <div className="ambient-menu__head">
            <div>
              <p className="ambient-menu__title mono">Background music</p>
              <p className="ambient-menu__now">
                {playing ? "Playing" : "Paused"} · <span>{current.name}</span>
              </p>
            </div>
            <button type="button" className="ambient-menu__play" onClick={togglePlay} aria-label={playing ? "Pause music" : `Play ${current.name}`}>
              <Icon name={playing ? "pause" : "play"} size={15} strokeWidth={2} />
            </button>
          </div>
          <ul className="ambient-menu__list">
            {PRESETS.map((p) => {
              const active = p.id === track;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    className={`ambient-menu__item${active ? " is-active" : ""}`}
                    onClick={() => choose(p.id)}
                  >
                    <span className="ambient-menu__state" aria-hidden="true">
                      {active && playing ? (
                        <span className="ambient__bars">
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <Icon name="play" size={11} strokeWidth={2} />
                      )}
                    </span>
                    <span className="ambient-menu__name">{p.name}</span>
                    <span className="ambient-menu__note">{p.note}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
