"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsapConfig";
import { content } from "@/lib/content";

const WEEKDAYS = ["Дү", "Ше", "Ша", "Бе", "Жм", "Иш", "Жк"];

function buildMonthGrid(dateISO: string) {
  const date = new Date(dateISO);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // JS getDay(): 0 = Sunday. Shift so Monday = 0.
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return { cells, year };
}

export default function CalendarSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { cells, year } = useMemo(() => buildMonthGrid(content.eventDateISO), []);

  useEffect(() => {
    registerGsap();
    const el = gridRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      { reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        const cellEls = el.querySelectorAll("[data-cell]");

        if (reduced) {
          gsap.set(cellEls, { opacity: 1, scale: 1 });
          return;
        }

        gsap.set(cellEls, { opacity: 0, scale: 0.6 });

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(cellEls, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.7)",
              stagger: { each: 0.012, from: "start" },
            }),
        });

        return () => trigger.kill();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="flex flex-col items-center gap-6 px-6 py-24">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
        Той-күн
      </p>
      <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
        {content.eventMonthLabel} {year}
      </h2>

      <div ref={gridRef} className="grid w-full max-w-xs grid-cols-7 gap-y-3 sm:max-w-sm">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-xs uppercase tracking-wide text-[var(--color-text-muted)]"
          >
            {wd}
          </div>
        ))}

        {cells.map((day, i) => {
          const isEventDay = day === content.eventDay;
          return (
            <div key={i} data-cell className="flex items-center justify-center py-1">
              {day && (
                <span
                  className={
                    isEventDay
                      ? "flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold)] font-serif text-base font-medium text-[var(--color-bg)]"
                      : "flex h-8 w-8 items-center justify-center font-serif text-base text-[var(--color-text)]"
                  }
                >
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-center font-serif text-lg italic text-[var(--color-text-muted)]">
        {content.eventDateDisplay}, саат {content.eventTimeDisplay}дө
      </p>
    </section>
  );
}
