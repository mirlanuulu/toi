"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsapConfig";
import { content, ui } from "@/lib/content";

type IntroScreenProps = {
  /** Вызывается синхронно в обработчике клика — здесь родитель должен
   *  запустить audio.play(), это единственный надёжный момент для автоплея. */
  onOpen: () => void;
};

export default function IntroScreen({ onOpen }: IntroScreenProps) {
  const [closed, setClosed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // set + to, а не from: в Strict Mode эффект отрабатывает дважды,
    // и killed from-твин оставил бы карточку на opacity 0.
    gsap.set(cardRef.current, { y: 60, opacity: 0, scale: 0.94 });
    gsap.set(hintRef.current, { opacity: 0, y: 12 });

    const tl = gsap.timeline();
    tl.to(cardRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
    }).to(hintRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");

    const float = gsap.to(cardRef.current, {
      y: -10,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.2,
    });
    const pulse = gsap.to(hintRef.current, {
      opacity: 0.45,
      duration: 1.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.2,
    });

    return () => {
      tl.kill();
      float.kill();
      pulse.kill();
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

    tl.to(hintRef.current, { opacity: 0, duration: 0.25 })
      .to(cardRef.current, { scale: 1.06, duration: 0.35, ease: "power2.out" }, 0)
      .to(
        cardRef.current,
        { y: "-115%", rotate: -3, duration: 1, ease: "power3.inOut" },
        0.25,
      )
      .to(overlayRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.6);
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-cream)] px-6"
      role="button"
      tabIndex={0}
      aria-label={ui.introHint}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleOpen();
      }}
    >
      <div className="flex flex-col items-center gap-8">
        <div
          ref={cardRef}
          className="relative aspect-[3/4] w-[74vw] max-w-sm overflow-hidden rounded-[2px] shadow-[0_30px_60px_-20px_rgba(44,38,32,0.45)] ring-1 ring-[var(--color-gold)]/40"
        >
          <Image
            src="/images/intro-card.png"
            alt=""
            fill
            priority
            sizes="(min-width: 640px) 384px, 74vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-text)]/45 via-transparent to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 p-6 text-center">
            <p className="font-serif text-3xl text-[var(--color-bg)] sm:text-4xl">
              {content.groomName} &amp; {content.brideName}
            </p>
            <p className="text-xs tracking-[0.35em] text-[var(--color-bg)]/85">
              {content.eventDateDisplay}
            </p>
          </div>
        </div>

        <p
          ref={hintRef}
          className="text-center text-sm tracking-[0.2em] text-[var(--color-text-muted)]"
        >
          {ui.introHint}
        </p>
      </div>
    </div>
  );
}
