import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Нурбек & Керемет — Той чакыруу",
  description: "Тоюбуздун кубанычын биз менен бөлүшүүгө чакырабыз.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ky"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <SmoothScroll />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
