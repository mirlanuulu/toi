"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsapConfig";
import { content } from "@/lib/content";
import Divider from "@/components/ui/Divider";

export default function InvitationSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      { reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        const words = el.querySelectorAll("[data-word]");
        gsap.set(words, { opacity: reduced ? 1 : 0.15 });

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 75%",
          end: "bottom 55%",
          scrub: reduced ? false : 0.6,
          onEnter: reduced ? () => gsap.set(words, { opacity: 1 }) : undefined,
          onUpdate: reduced
            ? undefined
            : (self) => {
                const progress = self.progress;
                words.forEach((word, i) => {
                  const threshold = i / words.length;
                  gsap.to(word, {
                    opacity: progress > threshold ? 1 : 0.15,
                    duration: 0.2,
                    overwrite: "auto",
                  });
                });
              },
        });

        return () => trigger.kill();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="flex flex-col items-center gap-8 px-6 py-28 text-center">
      <Divider />
      <p className="font-serif text-xl italic text-[var(--color-gold)] sm:text-2xl">
        {content.invitationGreeting}
      </p>
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
