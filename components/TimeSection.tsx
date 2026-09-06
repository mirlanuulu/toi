"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsapConfig";
import { content, ui } from "@/lib/content";

/** Время начала тоя — отдельный акцентный блок с циферблатом. */
export default function TimeSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add(
      { reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        const cleanups: (() => void)[] = [];

        const ring = root.querySelector("[data-ring]");
        const hour = root.querySelector("[data-hand-hour]");
        const minute = root.querySelector("[data-hand-minute]");
        const items = root.querySelectorAll("[data-line]");

        gsap.set(items, { opacity: reduced ? 1 : 0, y: reduced ? 0 : 22 });
        gsap.set(ring, { scale: reduced ? 1 : 0.8, opacity: reduced ? 1 : 0 });
        // Стрелки стартуют с 12 часов и доводятся до 16:00.
        // svgOrigin — центр циферблата в координатах viewBox: у линии
        // нулевая ширина bbox, поэтому обычный transformOrigin не годится.
        gsap.set([hour, minute], { rotate: 0, svgOrigin: "50 50" });

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top 75%",
          once: true,
          onEnter: () => {
            if (reduced) {
              gsap.set(hour, { rotate: 120 });
              return;
            }
            const tl = gsap.timeline();
            tl.to(ring, { scale: 1, opacity: 1, duration: 1, ease: "power3.out" })
              .to(items, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 }, "-=0.6")
              // 16:00 -> часовая на 4 часа = 120deg, минутная полный круг
              .to(hour, { rotate: 120, duration: 1.4, ease: "power2.inOut" }, "-=0.8")
              .to(minute, { rotate: 360, duration: 1.4, ease: "power2.inOut" }, "<");
          },
        });
        cleanups.push(() => trigger.kill());

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="flex flex-col items-center gap-8 px-6 py-24 text-center"
    >
      <p data-line className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
        {ui.timeLabel}
      </p>

      <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
        <svg
          data-ring
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="47" fill="none" stroke="var(--color-gold-soft)" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-gold)" strokeWidth="0.4" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="6"
              x2="50"
              y2={i % 3 === 0 ? 12 : 9.5}
              stroke="var(--color-gold)"
              strokeWidth={i % 3 === 0 ? 1 : 0.5}
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}

          <line
            data-hand-hour
            x1="50"
            y1="50"
            x2="50"
            y2="28"
            stroke="var(--color-text)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            data-hand-minute
            x1="50"
            y1="50"
            x2="50"
            y2="17"
            stroke="var(--color-gold)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="1.8" fill="var(--color-gold)" />
        </svg>
      </div>

      <p
        data-line
        className="font-serif text-6xl leading-none tabular-nums text-[var(--color-text)] sm:text-7xl"
      >
        {content.eventTimeDisplay}
      </p>
    </section>
  );
}
