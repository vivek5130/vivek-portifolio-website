/*
 * Background music generated live with the Web Audio API: no audio files, nothing copied, so
 * there's no licence to worry about. Each preset builds its own small sound graph into `out`
 * and returns a stop function that fades it out and cleans up.
 */

export type PresetId = "calm" | "lofi" | "ocean" | "rain" | "focus";
type Stop = () => void;
type Preset = { id: PresetId; name: string; note: string; start: (ctx: AudioContext, out: AudioNode) => Stop };

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const FADE = 1.2;

/** A preset's own output, fading in now and out on stop. */
function bus(ctx: AudioContext, out: AudioNode) {
  const g = ctx.createGain();
  g.gain.value = 0;
  g.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
  g.connect(out);
  return g;
}

/** Fades the bus out, then runs cleanup (stopping sources and timers) once it's silent. */
function fadeAndStop(ctx: AudioContext, g: GainNode, cleanup: () => void) {
  g.gain.setTargetAtTime(0, ctx.currentTime, FADE / 4);
  window.setTimeout(() => {
    cleanup();
    g.disconnect();
  }, FADE * 1000 + 200);
}

/** Two seconds of looping white noise, the raw material for waves and rain. */
function noise(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.start();
  return src;
}

function lfo(ctx: AudioContext, rate: number, depth: number, target: AudioParam) {
  const osc = ctx.createOscillator();
  const amount = ctx.createGain();
  osc.frequency.value = rate;
  amount.gain.value = depth;
  osc.connect(amount).connect(target);
  osc.start();
  return osc;
}

/** Soft echo send for a sense of space. */
function echo(ctx: AudioContext, from: AudioNode, to: AudioNode, time = 0.45, fb = 0.35, mix = 0.3) {
  const delay = ctx.createDelay(2);
  const feedback = ctx.createGain();
  const wet = ctx.createGain();
  delay.delayTime.value = time;
  feedback.gain.value = fb;
  wet.gain.value = mix;
  from.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(to);
}

/** One sustained chord: quiet triangle + detuned sine per note, slow attack and release. */
function padChord(ctx: AudioContext, notes: number[], to: AudioNode, seconds: number, level = 0.05) {
  const now = ctx.currentTime;
  for (const note of notes) {
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(level, now + 3);
    env.gain.setValueAtTime(level, now + seconds - 4);
    env.gain.linearRampToValueAtTime(0, now + seconds);
    env.connect(to);
    for (const [type, detune] of [["triangle", 0], ["sine", 7]] as const) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = hz(note);
      osc.detune.value = detune;
      osc.connect(env);
      osc.start(now);
      osc.stop(now + seconds + 0.1);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Presets                                                             */
/* ------------------------------------------------------------------ */

// Cmaj9, Am9, Fmaj7, Em7: open voicings that loop smoothly.
const CALM_CHORDS = [
  [48, 55, 59, 62, 64],
  [45, 52, 55, 59, 64],
  [41, 48, 52, 55, 60],
  [40, 47, 50, 55, 59],
];

const calm: Preset = {
  id: "calm",
  name: "Calm Pad",
  note: "Soft drifting chords",
  start(ctx, out) {
    const g = bus(ctx, out);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.6;
    const sweep = lfo(ctx, 0.05, 350, filter.frequency);
    filter.connect(g);
    echo(ctx, filter, g);
    let i = 0;
    const next = () => padChord(ctx, CALM_CHORDS[i++ % CALM_CHORDS.length], filter, 12);
    next();
    const timer = window.setInterval(next, 8000);
    return () => fadeAndStop(ctx, g, () => (window.clearInterval(timer), sweep.stop()));
  },
};

// ii–V–I–vi in D: Em9, A13, Dmaj9, Bm9 (as arpeggio notes) with root bass.
const LOFI_CHORDS = [
  { bass: 40, notes: [64, 67, 71, 74, 66] },
  { bass: 45, notes: [61, 66, 67, 71, 73] },
  { bass: 38, notes: [62, 66, 69, 73, 76] },
  { bass: 47, notes: [62, 66, 69, 71, 73] },
];

const lofi: Preset = {
  id: "lofi",
  name: "Lo-fi Keys",
  note: "Mellow keys & vinyl",
  start(ctx, out) {
    const g = bus(ctx, out);
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2200;
    tone.connect(g);
    echo(ctx, tone, g, 0.375, 0.3, 0.25);

    // Faint vinyl crackle.
    const crackle = noise(ctx);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 3500;
    band.Q.value = 0.8;
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.006;
    crackle.connect(band).connect(crackleGain).connect(g);

    const pluck = (midi: number, level: number, decay: number) => {
      const now = ctx.currentTime;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(level, now + 0.015);
      env.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      env.connect(tone);
      for (const [type, mult, amp] of [["sine", 1, 1], ["triangle", 2, 0.25]] as const) {
        const osc = ctx.createOscillator();
        const a = ctx.createGain();
        osc.type = type;
        osc.frequency.value = hz(midi) * mult;
        a.gain.value = amp;
        osc.connect(a).connect(env);
        osc.start(now);
        osc.stop(now + decay + 0.05);
      }
    };

    let step = 0;
    const beat = () => {
      const chord = LOFI_CHORDS[Math.floor(step / 8) % LOFI_CHORDS.length];
      if (step % 8 === 0) pluck(chord.bass, 0.07, 3.2);
      // A loose, slightly random arpeggio so it doesn't sound mechanical.
      if (step % 8 !== 7 && Math.random() > 0.15) pluck(chord.notes[(step * 3) % chord.notes.length], 0.035, 1.6);
      step++;
    };
    beat();
    const timer = window.setInterval(beat, 600);
    return () => fadeAndStop(ctx, g, () => (window.clearInterval(timer), crackle.stop()));
  },
};

const ocean: Preset = {
  id: "ocean",
  name: "Ocean Drift",
  note: "Rolling waves",
  start(ctx, out) {
    const g = bus(ctx, out);
    // Waves: noise through a low-pass whose cutoff and volume swell together.
    const waves = noise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 650;
    const swell = ctx.createGain();
    swell.gain.value = 0.12;
    waves.connect(filter).connect(swell).connect(g);
    const l1 = lfo(ctx, 0.09, 450, filter.frequency);
    const l2 = lfo(ctx, 0.09, 0.09, swell.gain);

    // A low, warm hum underneath.
    const hum = ctx.createGain();
    hum.gain.value = 0.025;
    hum.connect(g);
    const drones = [45, 52].map((m) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = hz(m);
      osc.connect(hum);
      osc.start();
      return osc;
    });
    return () => fadeAndStop(ctx, g, () => [waves, l1, l2, ...drones].forEach((s) => s.stop()));
  },
};

const rain: Preset = {
  id: "rain",
  name: "Night Rain",
  note: "Soft rain, distant chords",
  start(ctx, out) {
    const g = bus(ctx, out);
    // Rain hiss (high) plus a soft rumble (low).
    const hiss = noise(ctx);
    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 1400;
    const soften = ctx.createBiquadFilter();
    soften.type = "lowpass";
    soften.frequency.value = 7000;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.07;
    hiss.connect(high).connect(soften).connect(hissGain).connect(g);

    const rumble = noise(ctx);
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 380;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.05;
    rumble.connect(low).connect(rumbleGain).connect(g);
    const drift = lfo(ctx, 0.13, 0.02, hissGain.gain);

    // Distant minor chords: Am7 → Fmaj7.
    const pad = ctx.createBiquadFilter();
    pad.type = "lowpass";
    pad.frequency.value = 700;
    pad.connect(g);
    const chords = [
      [45, 52, 55, 60],
      [41, 48, 52, 57],
    ];
    let i = 0;
    const next = () => padChord(ctx, chords[i++ % chords.length], pad, 14, 0.03);
    next();
    const timer = window.setInterval(next, 10000);
    return () => fadeAndStop(ctx, g, () => (window.clearInterval(timer), [hiss, rumble, drift].forEach((s) => s.stop())));
  },
};

const focus: Preset = {
  id: "focus",
  name: "Deep Focus",
  note: "Low, steady drone",
  start(ctx, out) {
    const g = bus(ctx, out);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.connect(g);
    // Slightly different pitches left and right give a slow, gentle pulse in headphones.
    const voices = [
      { f: 110, pan: -0.6, level: 0.06 },
      { f: 116, pan: 0.6, level: 0.06 },
      { f: 165, pan: 0, level: 0.025 },
      { f: 220, pan: 0, level: 0.012 },
    ].map(({ f, pan, level }) => {
      const osc = ctx.createOscillator();
      const p = ctx.createStereoPanner();
      const a = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      p.pan.value = pan;
      a.gain.value = level;
      osc.connect(a).connect(p).connect(filter);
      osc.start();
      return osc;
    });
    const breathe = lfo(ctx, 0.04, 150, filter.frequency);
    return () => fadeAndStop(ctx, g, () => [...voices, breathe].forEach((s) => s.stop()));
  },
};

export const PRESETS: Preset[] = [calm, lofi, ocean, rain, focus];
export const DEFAULT_PRESET: PresetId = "calm";
