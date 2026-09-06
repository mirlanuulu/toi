"use client";

import { useRef, useSyncExternalStore } from "react";
import { content } from "@/lib/content";
import Divider from "@/components/ui/Divider";
import FadeIn from "@/components/ui/FadeIn";

type TimeLeft = { days: number; hours: number; minutes: number };

function getTimeLeft(targetISO: string): TimeLeft {
  const diff = Math.max(0, new Date(targetISO).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

function subscribe(callback: () => void) {
  const id = setInterval(callback, 60_000);
  return () => clearInterval(id);
}

function useCountdown(targetISO: string) {
  // getSnapshot must return a referentially stable value when nothing
  // changed, or useSyncExternalStore re-renders in an infinite loop.
  const cache = useRef<TimeLeft | null>(null);

  function getSnapshot() {
    const next = getTimeLeft(targetISO);
    const prev = cache.current;
    if (prev && prev.days === next.days && prev.hours === next.hours && prev.minutes === next.minutes) {
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
    { label: "дней", value: timeLeft?.days },
    { label: "часов", value: timeLeft?.hours },
    { label: "минут", value: timeLeft?.minutes },
  ];

  return (
    <section className="flex flex-col items-center gap-8 px-6 py-24">
      <FadeIn className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
          До тоя осталось
        </p>
      </FadeIn>

      <div className="flex gap-6 sm:gap-10">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center gap-1">
            <span className="font-serif text-4xl text-[var(--color-text)] sm:text-5xl">
              {unit.value ?? "--"}
            </span>
            <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <Divider />
    </section>
  );
}
