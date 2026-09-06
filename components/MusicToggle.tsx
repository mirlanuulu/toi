"use client";

import { Volume2, VolumeX } from "lucide-react";

type MusicToggleProps = {
  visible: boolean;
  muted: boolean;
  onToggle: () => void;
};

export default function MusicToggle({ visible, muted, onToggle }: MusicToggleProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Включить музыку" : "Выключить музыку"}
      aria-pressed={!muted}
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-gold)] bg-[var(--color-bg)]/90 text-[var(--color-gold)] shadow-sm backdrop-blur transition-colors hover:bg-[var(--color-gold-soft)]/40"
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
