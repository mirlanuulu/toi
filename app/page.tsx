"use client";

import { useRef, useState } from "react";
import IntroScreen from "@/components/IntroScreen";
import HeroSection from "@/components/HeroSection";
import InvitationSection from "@/components/InvitationSection";
import CalendarSection from "@/components/CalendarSection";
import CountdownSection from "@/components/CountdownSection";
import DetailsSection from "@/components/DetailsSection";
import MarqueeSection from "@/components/MarqueeSection";
import WhatsAppSection from "@/components/WhatsAppSection";
import MusicToggle from "@/components/MusicToggle";

export default function Home() {
  const [introOpened, setIntroOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleIntroOpen() {
    // Синхронно с кликом — единственный надёжный момент для автоплея,
    // особенно на iOS Safari.
    audioRef.current?.play().catch(() => {
      // Автоплей может быть заблокирован — кнопка mute/unmute остаётся
      // рабочим ручным fallback'ом.
    });
    setIntroOpened(true);
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/wedding-song.mp3" loop preload="none" />

      <IntroScreen onOpen={handleIntroOpen} />

      <main>
        <HeroSection play={introOpened} />
        <InvitationSection />
        <CalendarSection />
        <CountdownSection />
        <DetailsSection />
        <MarqueeSection />
        <WhatsAppSection />
      </main>

      <MusicToggle visible={introOpened} muted={muted} onToggle={toggleMute} />
    </>
  );
}
