// app/fonts.ts
import { Playfair_Display, Inter } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  // évite le jump entre fallback et font finale
  adjustFontFallback: true,
  fallback: ["Times New Roman", "serif"],
});

export const inter = Inter({ subsets: ["latin"], display: "swap" });
