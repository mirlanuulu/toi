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
        gsap.set(items, { y: reduced ? 0 : 24, opacity: reduced ? 1 : 0 });

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top 78%",
          once: true,
          onEnter: () =>
            gsap.to(items, {
              y: 0,
              opacity: 1,
              duration: reduced ? 0.01 : 0.8,
              ease: "power3.out",
              stagger: reduced ? 0 : 0.1,
            }),
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
        className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border-2 border-[var(--color-gold)]/45 bg-[var(--color-cream)]/70 px-6 py-10 shadow-[0_16px_50px_-24px_rgba(44,38,32,0.4)] sm:px-10"
      >
        <p className="max-w-xs font-serif text-xl leading-relaxed text-[var(--color-text)] sm:text-2xl">
          {rsvpHint()}
        </p>

      <div className="flex w-full max-w-sm flex-col gap-5">
        <div className="relative">
          <input
            id="rsvp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={ui.rsvpNamePlaceholder}
            aria-label={ui.rsvpNameLabel}
            className="w-full border-0 border-b border-[var(--color-gold-soft)] bg-transparent px-1 pb-3 text-center font-serif text-3xl italic tracking-wide text-[var(--color-text)] outline-none transition-colors placeholder:text-xl placeholder:text-[var(--color-text-muted)]/55 focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {content.rsvpContacts.map(({ side, phone }) => (
            <a
              key={phone}
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
              className={`group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl px-3 py-4 transition-all duration-300 ${
                canSend
                  ? "cursor-pointer bg-[var(--color-gold)] text-[var(--color-bg)] shadow-[0_10px_30px_-10px_rgba(201,169,106,0.8)] hover:scale-[1.03]"
                  : "cursor-not-allowed border border-[var(--color-gold-soft)] text-[var(--color-text-muted)]/70"
              }`}
            >
              {canSend && (
                <span
                  aria-hidden="true"
                  className="shimmer pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                />
              )}
              <span className="relative flex items-center gap-1.5 font-serif text-lg leading-none">
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {side}
              </span>
              <span className="relative whitespace-nowrap text-[0.7rem] tracking-wide opacity-90">
                {ui.rsvpSend}
              </span>
            </a>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
