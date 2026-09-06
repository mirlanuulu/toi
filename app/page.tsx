"use client";

import { useEffect, useRef, useState } from "react";
import IntroScreen from "@/components/IntroScreen";
import HeroSection from "@/components/HeroSection";
import InvitationSection from "@/components/InvitationSection";
import CalendarSection from "@/components/CalendarSection";
import CountdownSection from "@/components/CountdownSection";
import TimeSection from "@/components/TimeSection";
import DetailsSection from "@/components/DetailsSection";
import MarqueeSection from "@/components/MarqueeSection";
import WhatsAppSection from "@/components/WhatsAppSection";
import MusicToggle from "@/components/MusicToggle";
import Petals from "@/components/ui/Petals";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function Home() {
  const [introOpened, setIntroOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Гость свернул браузер или переключил вкладку — музыка не должна
  // играть в фоне и мешать окружающим.
  useEffect(() => {
    function pauseAudio() {
      audioRef.current?.pause();
    }

    function resumeAudio() {
      if (!playing || document.hidden) return;
      audioRef.current?.play().catch(() => {});
    }

    function handleVisibility() {
      if (document.hidden) pauseAudio();
      else resumeAudio();
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", pauseAudio);
    window.addEventListener("blur", pauseAudio);
    window.addEventListener("focus", resumeAudio);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", pauseAudio);
      window.removeEventListener("blur", pauseAudio);
      window.removeEventListener("focus", resumeAudio);
    };
  }, [playing]);

  function handleIntroOpen() {
    // Синхронно с кликом — единственный надёжный момент для автоплея,
    // особенно на iOS Safari.
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Автоплей может быть заблокирован — кнопка остаётся ручным fallback'ом.
        setPlaying(false);
      });
    setIntroOpened(true);
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/wedding-song.mp3" loop preload="none" />

      <ScrollProgress />
      <Petals />

      <IntroScreen onOpen={handleIntroOpen} />

      <main>
        <HeroSection play={introOpened} />
        <InvitationSection />
        <CalendarSection />
        <TimeSection />
        <CountdownSection />
        <DetailsSection />
        <MarqueeSection />
        <WhatsAppSection />
      </main>

      <MusicToggle visible={introOpened} playing={playing} onToggle={toggleMusic} />
    </>
  );
}
