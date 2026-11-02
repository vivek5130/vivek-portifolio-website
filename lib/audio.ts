/** Lets the read-aloud voice and the ambient music coordinate (the music dips while the voice speaks). */
export const VOICE_EVENT = "portfolio:voice";

export function announceVoice(speaking: boolean) {
  window.dispatchEvent(new CustomEvent(VOICE_EVENT, { detail: { speaking } }));
}
