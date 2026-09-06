"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsapConfig";
import { content, ui } from "@/lib/content";
import ScrollCue from "@/components/ui/ScrollCue";

export default function DetailsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const inner = contentRef.current;
    const bg = bgRef.current;
    if (!section || !inner) return;

    const mm = gsap.matchMedia();
    mm.add(
      { reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        const cleanups: (() => void)[] = [];
        const lines = inner.querySelectorAll("[data-line]");

        gsap.set(lines, { y: reduced ? 0 : 28, opacity: reduced ? 1 : 0 });
        const reveal = ScrollTrigger.create({
          trigger: inner,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(lines, {
              y: 0,
              opacity: 1,
              duration: reduced ? 0.01 : 0.9,
              ease: "power3.out",
              stagger: reduced ? 0 : 0.09,
            }),
        });
        cleanups.push(() => reveal.kill());

        if (bg && !reduced) {
          const parallax = gsap.to(bg, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          });
          cleanups.push(() => parallax.scrollTrigger?.kill());
        }

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-28"
    >
      <div ref={bgRef} className="absolute inset-0 -top-16 -bottom-16" aria-hidden="true">
        <Image
          src="/images/couple-1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[var(--color-bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)]" />
      </div>

      <div ref={contentRef} className="relative flex flex-col items-center text-center">
        <p
          data-line
          className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]"
        >
          {ui.detailsLabel}
        </p>

        <p
          data-line
          className="mt-6 font-serif text-6xl leading-none text-[var(--color-text)] sm:text-8xl"
        >
          {content.eventDay}
        </p>
        <p
          data-line
          className="mt-2 font-serif text-2xl italic text-[var(--color-gold)] sm:text-3xl"
        >
          {content.eventMonthLabel.toLowerCase()} {content.eventYear}
        </p>
        <p data-line className="mt-3 text-sm tracking-[0.2em] text-[var(--color-text-muted)]">
          саат {content.eventTimeDisplay}дө
        </p>

        <span data-line className="my-9 h-px w-24 bg-[var(--color-gold)]" aria-hidden="true" />

        <p data-line className="font-serif text-4xl text-[var(--color-text)] sm:text-5xl">
          «{content.venueName}»
        </p>
        <p data-line className="mt-3 text-[var(--color-text-muted)]">
          {content.venueAddress}
        </p>

        <a
          data-line
          href={content.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex items-center gap-2 border-b border-[var(--color-gold)] pb-1 text-sm tracking-wide text-[var(--color-text)] transition-colors hover:text-[var(--color-gold)]"
        >
          {ui.mapLink}
          <ArrowUpRight
            size={16}
            className="text-[var(--color-gold)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>

        <p
          data-line
          className="mt-14 max-w-xs text-sm italic leading-relaxed text-[var(--color-text-muted)]"
        >
          {ui.hostsLabel}: {content.hosts.map((h) => `${h.name1} & ${h.name2}`).join(", ")}
        </p>

        <span data-line className="mt-10 block">
          <ScrollCue />
        </span>
      </div>
    </section>
  );
}
