"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsapConfig";
import { content, ui } from "@/lib/content";

function splitToChars(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} data-char className="inline-block will-change-transform">
      {char}
    </span>
  ));
}

export default function HeroSection({ play }: { play: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play) return;
    const root = rootRef.current;
    if (!root) return;

    const chars = root.querySelectorAll("[data-char]");
    const amp = root.querySelector("[data-amp]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set([chars, amp, restRef.current, bgRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(chars, { opacity: 0, yPercent: 110 });
    gsap.set(amp, { opacity: 0, scale: 0.4 });
    gsap.set(restRef.current, { opacity: 0, y: 20 });
    gsap.set(bgRef.current, { scale: 1.15, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(bgRef.current, { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }, 0)
      .to(
        chars,
        { opacity: 1, yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.04 },
        0.1,
      )
      .to(amp, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(2)" }, "-=0.6")
      .to(restRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.4");
  }, [play]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div ref={bgRef} className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/couple-1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/60 to-[var(--color-bg)]" />
      </div>

      <div className="relative flex flex-col items-center">
        <p className="mb-6 text-[0.65rem] uppercase tracking-[0.5em] text-[var(--color-text-muted)] sm:text-xs">
          {content.eventDateDisplay}
        </p>

        <h1 className="flex flex-col items-center font-serif leading-[0.9] text-[var(--color-text)]">
          <span className="overflow-hidden">
            <span className="block whitespace-nowrap text-[3.75rem] sm:text-8xl lg:text-9xl">
              {splitToChars(content.groomName)}
            </span>
          </span>

          <span
            data-amp
            className="my-1 block font-serif text-3xl italic text-[var(--color-gold)] sm:my-2 sm:text-5xl"
          >
            &amp;
          </span>

          <span className="overflow-hidden">
            <span className="block whitespace-nowrap text-[3.75rem] sm:text-8xl lg:text-9xl">
              {splitToChars(content.brideName)}
            </span>
          </span>
        </h1>
      </div>

      <div ref={restRef} className="relative mt-10 flex flex-col items-center gap-5">
        <span className="h-px w-16 bg-[var(--color-gold)]" aria-hidden="true" />
        <p className="max-w-xs font-serif text-lg italic leading-relaxed text-[var(--color-text-muted)] sm:max-w-md sm:text-xl">
          {ui.heroTagline}
        </p>
      </div>
    </section>
  );
}
