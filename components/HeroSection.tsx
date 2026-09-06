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

function splitToWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom">
      <span data-word className="inline-block will-change-transform">
        {word}
        {" "}
      </span>
    </span>
  ));
}

export default function HeroSection({ play }: { play: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!play) return;
    const root = rootRef.current;
    if (!root) return;

    const chars = root.querySelectorAll("[data-char]");
    const amp = root.querySelector("[data-amp]");
    const words = root.querySelectorAll("[data-word]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set([chars, amp, words, bgRef.current], { opacity: 1, y: 0, yPercent: 0, scale: 1 });
      gsap.set(ruleRef.current, { scaleX: 1, opacity: 1 });
      return;
    }

    gsap.set(chars, { opacity: 0, yPercent: 110 });
    gsap.set(amp, { opacity: 0, scale: 0.4, rotate: -25 });
    gsap.set(words, { yPercent: 120 });
    gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "center" });
    gsap.set(bgRef.current, { scale: 1.15, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(bgRef.current, { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }, 0)
      .to(
        chars,
        { opacity: 1, yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.04 },
        0.1,
      )
      .to(amp, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2)" }, "-=0.7")
      .to(ruleRef.current, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.3")
      .to(
        words,
        { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.055 },
        "-=0.5",
      );

    return () => {
      tl.kill();
    };
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

      <p className="relative mb-8 text-[0.65rem] uppercase tracking-[0.5em] text-[var(--color-text-muted)] sm:text-xs">
        {content.eventDateDisplay}
      </p>

      <h1 className="relative flex w-[min(88vw,34rem)] flex-col font-serif leading-[0.88] text-[var(--color-text)]">
        <span className="self-start overflow-hidden pl-1">
          <span className="block whitespace-nowrap text-[3.5rem] sm:text-8xl lg:text-9xl">
            {splitToChars(content.groomName)}
          </span>
        </span>

        <span
          data-amp
          className="my-1 self-center font-serif text-4xl italic text-[var(--color-gold)] sm:my-3 sm:text-6xl"
        >
          &amp;
        </span>

        <span className="self-end overflow-hidden pr-1">
          <span className="block whitespace-nowrap text-[3.5rem] sm:text-8xl lg:text-9xl">
            {splitToChars(content.brideName)}
          </span>
        </span>
      </h1>

      <div className="relative mt-12 flex flex-col items-center gap-6">
        <span
          ref={ruleRef}
          className="block h-px w-20 bg-[var(--color-gold)]"
          aria-hidden="true"
        />
        <p
          ref={taglineRef}
          className="max-w-[21rem] font-serif text-[2.1rem] italic leading-[1.25] text-[var(--color-text)] sm:max-w-2xl sm:text-5xl sm:leading-[1.2]"
        >
          {splitToWords(ui.heroTagline)}
        </p>
      </div>
    </section>
  );
}
