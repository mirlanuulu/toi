"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapConfig";

type IntroScreenProps = {
  /** Вызывается синхронно в обработчике клика — здесь родитель должен
   *  запустить audio.play(), это единственный надёжный момент для автоплея. */
  onOpen: () => void;
};

export default function IntroScreen({ onOpen }: IntroScreenProps) {
  const [closed, setClosed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const breathe = gsap.to(diamondRef.current, {
      scale: 1.12,
      duration: 2.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => {
      breathe.kill();
    };
  }, []);

  if (closed) return null;

  function handleOpen() {
    // Синхронно с жестом пользователя — до любых GSAP-таймлайнов.
    onOpen();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({
      onComplete: () => setClosed(true),
    });

    if (reduced) {
      tl.to(overlayRef.current, { opacity: 0, duration: 0.01 });
      return;
    }

    tl.to(overlayRef.current, { opacity: 1, duration: 0 })
      .to([panelLeftRef.current], { xPercent: -100, duration: 0.9, ease: "power3.inOut" }, 0.1)
      .to([panelRightRef.current], { xPercent: 100, duration: 0.9, ease: "power3.inOut" }, 0.1)
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex"
      role="button"
      tabIndex={0}
      aria-label="Нажмите, чтобы открыть приглашение"
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleOpen();
      }}
    >
      <div
        ref={panelLeftRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-[var(--color-cream)]"
      />
      <div
        ref={panelRightRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-[var(--color-cream)]"
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
        <div
          ref={diamondRef}
          aria-hidden="true"
          className="h-16 w-16 rotate-45 border border-[var(--color-gold)]"
        />
        <p className="font-serif text-3xl italic text-[var(--color-text)] sm:text-4xl">
          Той-беш
        </p>
        <p className="max-w-xs text-sm tracking-wide text-[var(--color-text-muted)]">
          Нажмите, чтобы открыть приглашение
        </p>
      </div>
    </div>
  );
}
