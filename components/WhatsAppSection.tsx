"use client";

import { useState } from "react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Divider from "@/components/ui/Divider";
import { content } from "@/lib/content";

export default function WhatsAppSection() {
  const [name, setName] = useState("");

  const canSend = name.trim().length > 0;
  const message = `Ассалому алейкум! Менин атым ${name.trim()}. Тойго катышуумду ырастайм.`;
  const href = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
      <Divider />
      <p className="max-w-sm font-serif text-2xl italic text-[var(--color-text)] sm:text-3xl">
        Кубанычыбызга ортоктош болуңуздар!
      </p>

      <form
        className="mt-4 flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-[var(--color-gold-soft)] bg-[var(--color-cream)] p-8 text-left"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="rsvp-name" className="text-sm text-[var(--color-text-muted)]">
            Атыңыз
          </label>
          <input
            id="rsvp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Атыңызды жазыңыз"
            className="rounded-full border border-[var(--color-gold-soft)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]/60 focus-visible:border-[var(--color-gold)]"
          />
          <span className="text-sm text-[var(--color-text-muted)]">
            Тойго {content.rsvpDeadlineDisplay}га чейин катышууңузду ырастап коюңуз
          </span>
        </div>

        <a
          href={canSend ? href : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canSend}
          onClick={(e) => {
            if (!canSend) e.preventDefault();
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm tracking-wide transition-all ${
            canSend
              ? "cursor-pointer bg-[var(--color-gold)] text-[var(--color-bg)] hover:scale-[1.02] hover:bg-[var(--color-gold-soft)]"
              : "cursor-not-allowed bg-[var(--color-gold-soft)]/50 text-[var(--color-text-muted)]"
          }`}
        >
          <WhatsAppIcon className="h-5 w-5" />
          Жоопту жөнөтүү
        </a>
      </form>
    </section>
  );
}
