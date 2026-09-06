"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsapConfig";
import { content } from "@/lib/content";

export default function InvitationSection() {
  const ref = useRef<HTMLParagraphElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    const greeting = greetingRef.current;
    if (!el || !greeting) return;

    const mm = gsap.matchMedia();
    mm.add(
      { reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        const cleanups: (() => void)[] = [];
        const words = el.querySelectorAll("[data-word]");
        const greetingParts = greeting.querySelectorAll("[data-greet]");

        gsap.set(words, { opacity: reduced ? 1 : 0.12 });
        gsap.set(greetingParts, { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 });

        const greetTrigger = ScrollTrigger.create({
          trigger: greeting,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(greetingParts, {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.01 : 1,
              ease: "power3.out",
              stagger: reduced ? 0 : 0.14,
            }),
        });
        cleanups.push(() => greetTrigger.kill());

        // Проявление начинается только когда абзац уже заметно вошёл в экран.
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 70%",
          scrub: reduced ? false : 0.6,
          onEnter: reduced ? () => gsap.set(words, { opacity: 1 }) : undefined,
          onUpdate: reduced
            ? undefined
            : (self) => {
                const progress = self.progress;
                words.forEach((word, i) => {
                  const threshold = i / words.length;
                  gsap.to(word, {
                    opacity: progress > threshold ? 1 : 0.12,
                    duration: 0.2,
                    overwrite: "auto",
                  });
                });
              },
        });
        cleanups.push(() => trigger.kill());

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="flex flex-col items-center px-6 py-28 text-center">
      <div ref={greetingRef} className="flex flex-col items-center">
        <span
          data-greet
          className="mb-8 block h-10 w-px bg-gradient-to-b from-transparent to-[var(--color-gold)]"
          aria-hidden="true"
        />
        <p
          data-greet
          className="font-serif text-[2rem] italic leading-tight text-[var(--color-gold)] sm:text-5xl"
        >
          {content.invitationGreeting}
        </p>
        <span
          data-greet
          className="mt-8 mb-12 flex items-center gap-3"
          aria-hidden="true"
        >
          <span className="h-px w-12 bg-[var(--color-gold-soft)]" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[var(--color-gold)]" />
          <span className="h-px w-12 bg-[var(--color-gold-soft)]" />
        </span>
      </div>

      <p
        ref={ref}
        className="max-w-xl font-serif text-2xl leading-relaxed text-[var(--color-text)] sm:text-3xl sm:leading-relaxed"
      >
        {content.invitationBody.split(" ").map((word, i) => (
          <span key={i} data-word className="inline-block">
            {word}&nbsp;
          </span>
        ))}
      </p>
    </section>
  );
}
