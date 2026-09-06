"use client";

import { useRef, useSyncExternalStore } from "react";
import { content, ui } from "@/lib/content";
import Divider from "@/components/ui/Divider";
import FadeIn from "@/components/ui/FadeIn";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(targetISO: string): TimeLeft {
  const diff = Math.max(0, new Date(targetISO).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function useCountdown(targetISO: string) {
  // getSnapshot must return a referentially stable value when nothing
  // changed, or useSyncExternalStore re-renders in an infinite loop.
  const cache = useRef<TimeLeft | null>(null);

  function getSnapshot() {
    const next = getTimeLeft(targetISO);
    const prev = cache.current;
    if (
      prev &&
      prev.days === next.days &&
      prev.hours === next.hours &&
      prev.minutes === next.minutes &&
      prev.seconds === next.seconds
    ) {
      return prev;
    }
    cache.current = next;
    return next;
  }

  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export default function CountdownSection() {
  const timeLeft = useCountdown(content.eventDateISO);

  const units = [
    { label: ui.countdownUnits.days, value: timeLeft?.days },
    { label: ui.countdownUnits.hours, value: timeLeft?.hours },
    { label: ui.countdownUnits.minutes, value: timeLeft?.minutes },
    { label: ui.countdownUnits.seconds, value: timeLeft?.seconds },
  ];

  return (
    <section className="flex flex-col items-center gap-10 px-6 py-28">
      <FadeIn className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
          {ui.countdownLabel}
        </p>
      </FadeIn>

      <div className="flex w-full max-w-lg items-start justify-center gap-3 sm:gap-8">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex flex-1 items-start justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-5xl leading-none tabular-nums text-[var(--color-text)] sm:text-7xl">
                {unit.value ?? "--"}
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:text-xs">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span
                aria-hidden="true"
                className="ml-3 font-serif text-4xl leading-none text-[var(--color-gold-soft)] sm:ml-8 sm:text-6xl"
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>

      <Divider />
    </section>
  );
}
