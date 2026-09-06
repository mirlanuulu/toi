"use client";

import { useEffect, useState } from "react";
import { ui } from "@/lib/content";

/**
 * Пожилые гости могут не долистать до анкеты, поэтому кнопка висит поверх
 * страницы и уводит к ней в один тап. Прячется, когда анкета уже на экране.
 */
export default function RsvpJumpButton({ visible }: { visible: boolean }) {
  const [rsvpOnScreen, setRsvpOnScreen] = useState(false);

  useEffect(() => {
    const target = document.getElementById("rsvp");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setRsvpOnScreen(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px" },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  if (!visible || rsvpOnScreen) return null;

  return (
    <a
      href="#rsvp"
      className="pulse-gold fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-3.5 text-sm tracking-wide text-[var(--color-bg)] transition-transform hover:scale-[1.04]"
    >
      {ui.rsvpJump}
    </a>
  );
}
