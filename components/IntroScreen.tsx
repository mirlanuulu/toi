"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsapConfig";
import { ui } from "@/lib/content";

type IntroScreenProps = {
  /** Вызывается синхронно в обработчике клика — здесь родитель должен
   *  запустить audio.play(), это единственный надёжный момент для автоплея. */
  onOpen: () => void;
};

export default function IntroScreen({ onOpen }: IntroScreenProps) {
  const [closed, setClosed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // set + to, а не from: в Strict Mode эффект отрабатывает дважды,
    // и killed from-твин оставил бы элементы на opacity 0.
    gsap.set(photoRef.current, { scale: 1.12, opacity: 0 });
    gsap.set(buttonRef.current, { opacity: 0, y: 24 });

    const tl = gsap.timeline();
    tl.to(photoRef.current, { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" })
      .to(buttonRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=1");

    return () => {
      tl.kill();
    };
  }, []);

  if (closed) return null;

  function handleOpen() {
    // Синхронно с жестом пользователя — до любых GSAP-таймлайнов.
    onOpen();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({ onComplete: () => setClosed(true) });

    if (reduced) {
      tl.to(overlayRef.current, { opacity: 0, duration: 0.01 });
      return;
    }

    tl.to(buttonRef.current, { opacity: 0, scale: 0.92, duration: 0.4, ease: "power2.in" })
      // золотая вуаль наплывает снизу, скрывая фото
      .to(veilRef.current, { yPercent: 0, duration: 0.9, ease: "power3.inOut" }, 0.15)
      .to(photoRef.current, { scale: 1.18, duration: 1.4, ease: "power2.inOut" }, 0.15)
      // и уходит вверх, открывая сайт
      .to(veilRef.current, { yPercent: -100, duration: 1, ease: "power3.inOut" }, ">-0.05")
      .to(overlayRef.current, { opacity: 0, duration: 0.4 }, "-=0.45");
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 overflow-hidden bg-[var(--color-cream)]">
      <div ref={photoRef} className="absolute inset-0">
        <Image
          src="/images/intro-card.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/65 via-[var(--color-text)]/10 to-[var(--color-text)]/15" />
      </div>

      <div
        ref={veilRef}
        aria-hidden="true"
        className="absolute inset-0 translate-y-full bg-[var(--color-cream)]"
      />

      <div className="absolute inset-x-0 bottom-0 flex justify-center p-10 sm:p-14">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          className="group relative overflow-hidden rounded-full border border-[var(--color-bg)]/70 bg-[var(--color-bg)]/10 px-10 py-4 font-serif text-lg tracking-[0.15em] text-[var(--color-bg)] backdrop-blur-md transition-all duration-500 hover:border-[var(--color-bg)] hover:bg-[var(--color-bg)]/20 sm:text-xl"
        >
          <span
            aria-hidden="true"
            className="shimmer pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
          />
          <span className="relative">{ui.introButton}</span>
        </button>
      </div>
    </div>
  );
}
