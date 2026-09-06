"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsapConfig";
import { content } from "@/lib/content";
import Divider from "@/components/ui/Divider";

function splitToChars(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="inline-block will-change-transform">
      {char === " " ? " " : char}
    </span>
  ));
}

export default function HeroSection({ play }: { play: boolean }) {
  const namesRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play) return;
    const chars = namesRef.current?.querySelectorAll("span");
    if (!chars || chars.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(chars, { opacity: 1, y: 0 });
      gsap.set(restRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(chars, { opacity: 0, y: 24 });
    gsap.set(restRef.current, { opacity: 0, y: 16 });

    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.03,
    }).to(restRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");
  }, [play]);

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/couple-1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/70 to-[var(--color-bg)]" />
      </div>

      <div
        ref={namesRef}
        className="relative flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 font-serif text-4xl leading-tight text-[var(--color-text)] sm:gap-x-4 sm:text-7xl lg:text-8xl"
      >
        <span className="whitespace-nowrap">{splitToChars(content.groomName)}</span>
        <span className="inline-block align-middle text-[var(--color-gold)]">&amp;</span>
        <span className="whitespace-nowrap">{splitToChars(content.brideName)}</span>
      </div>

      <div ref={restRef} className="relative mt-6 flex flex-col items-center gap-4">
        <Divider />
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
          {content.eventDateDisplay}
        </p>
        <p className="max-w-md font-serif text-lg italic text-[var(--color-text)] sm:text-xl">
          Приглашаем вас разделить с нами радость нашего тоя
        </p>
      </div>
    </section>
  );
}
