"use client";

import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsapConfig";
import { content, ui, rsvpHint } from "@/lib/content";

export default function WhatsAppSection() {
  const [name, setName] = useState("");
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
        const items = root.querySelectorAll("[data-line]");
        const left = root.querySelector("[data-side='left']");
        const right = root.querySelector("[data-side='right']");
        const divider = root.querySelector("[data-divider]");
        const seal = root.querySelector("[data-seal]");

        gsap.set(items, { y: reduced ? 0 : 24, opacity: reduced ? 1 : 0 });
        gsap.set(left, { x: reduced ? 0 : -60, opacity: reduced ? 1 : 0 });
        gsap.set(right, { x: reduced ? 0 : 60, opacity: reduced ? 1 : 0 });
        gsap.set(divider, { scaleY: reduced ? 1 : 0, transformOrigin: "center" });
        gsap.set(seal, { scale: reduced ? 1 : 0, rotate: reduced ? 45 : 0, opacity: reduced ? 1 : 0 });

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top 78%",
          once: true,
          onEnter: () => {
            if (reduced) {
              gsap.set(items, { opacity: 1, y: 0 });
              return;
            }
            const tl = gsap.timeline();
            tl.to(items, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 })
              // две стороны сходятся к центру
              .to([left, right], { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.3")
              .to(divider, { scaleY: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.7")
              // и в точке встречи ставится печать
              .to(seal, { scale: 1, rotate: 45, opacity: 1, duration: 0.6, ease: "back.out(2.5)" }, "-=0.25");
          },
        });

        return () => trigger.kill();
      },
    );

    return () => mm.revert();
  }, []);

  const canSend = name.trim().length > 0;
  const message = `Ассалому алейкум! Менин атым ${name.trim()}. Тойго катышуумду ырастайм.`;

  return (
    <section
      id="rsvp"
      ref={rootRef}
      className="flex scroll-mt-16 flex-col items-center gap-8 px-6 py-28 text-center"
    >
      <span data-line className="h-px w-16 bg-[var(--color-gold)]" aria-hidden="true" />

      <p
        data-line
        className="max-w-md font-serif text-3xl italic leading-snug text-[var(--color-text)] sm:text-4xl"
      >
        {ui.rsvpTitle}
      </p>

      <div
        data-line
        className="flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border-2 border-[var(--color-gold)]/45 bg-[var(--color-cream)]/70 px-5 py-10 shadow-[0_16px_50px_-24px_rgba(44,38,32,0.4)] sm:px-8"
      >
        <p className="max-w-xs font-serif text-xl leading-relaxed text-[var(--color-text)] sm:text-2xl">
          {rsvpHint()}
        </p>

        <input
          id="rsvp-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={ui.rsvpNamePlaceholder}
          aria-label={ui.rsvpNameLabel}
          className="w-full max-w-sm border-0 border-b border-[var(--color-gold-soft)] bg-transparent px-1 pb-3 text-center font-serif text-3xl italic tracking-wide text-[var(--color-text)] outline-none transition-colors placeholder:text-xl placeholder:text-[var(--color-text-muted)]/55 focus:border-[var(--color-gold)]"
        />

        {/* Стенка на стенку: две стороны друг напротив друга */}
        <div className="relative grid w-full grid-cols-2">
          <span
            data-divider
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent"
          />
          <span
            data-seal
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[var(--color-gold)] bg-[var(--color-cream)]"
          >
            <span className="h-1 w-1 bg-[var(--color-gold)]" />
          </span>

          {content.rsvpContacts.map(({ side, phone }, i) => (
            <div
              key={phone}
              data-side={i === 0 ? "left" : "right"}
              className={`flex flex-col items-center gap-4 rounded-2xl bg-[var(--color-bg)]/55 px-3 py-6 ${
                i === 0 ? "mr-2.5" : "ml-2.5"
              }`}
            >
              <span className="whitespace-nowrap font-serif text-xl leading-none text-[var(--color-text)] sm:text-2xl">
                {side}
              </span>
              <span
                aria-hidden="true"
                className="-mt-2 h-px w-8 bg-[var(--color-gold-soft)]"
              />

              <a
                href={
                  canSend
                    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canSend}
                aria-label={`${side} — ${ui.rsvpSend}`}
                onClick={(e) => {
                  if (!canSend) e.preventDefault();
                }}
                className={`group relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-full px-2 py-3.5 text-[0.72rem] transition-all duration-300 ${
                  canSend
                    ? "cursor-pointer bg-[var(--color-gold)] text-[var(--color-bg)] shadow-[0_10px_30px_-10px_rgba(201,169,106,0.9)] hover:scale-[1.04]"
                    : "cursor-not-allowed border border-[var(--color-gold-soft)] text-[var(--color-text-muted)]/70"
                }`}
              >
                {canSend && (
                  <span
                    aria-hidden="true"
                    className="shimmer pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                  />
                )}
                <WhatsAppIcon className="relative h-4 w-4 shrink-0" />
                <span className="relative whitespace-nowrap">{ui.rsvpSendShort}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
