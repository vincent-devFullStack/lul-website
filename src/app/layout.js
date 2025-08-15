// app/layout.js
import { AuthProvider } from "@/context/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import "@/styles/base/globals.css";
import { Inter, Playfair_Display } from "next/font/google";

// Polices via next/font → variables utilisées dans le CSS (font-sans / font-serif)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  adjustFontFallback: true,
});

export const metadata = {
  metadataBase: new URL("https://www.iconodule.fr"),
  title: {
    default: "L'iconodule | Musée d'art virtuel",
    template: "%s | L'iconodule",
  },
  description:
    "Explorez notre collection unique d'œuvres d'art contemporain dans ce musée virtuel interactif",
  keywords: [
    "musée virtuel",
    "art contemporain",
    "galerie d'art",
    "iconodule",
    "exposition virtuelle",
  ],
  alternates: { canonical: "https://www.iconodule.fr" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.iconodule.fr",
    siteName: "L'iconodule",
    title: "L'iconodule | Musée d'art virtuel",
    description: "Explorez notre collection unique d'œuvres d'art contemporain",
    images: [
      {
        url: "https://www.iconodule.fr/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "L'iconodule - Musée virtuel",
      },
    ],
  },
};

// Viewport/Theme — recommandé par Lighthouse
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e3d4b4",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Aide le 1er hit Cloudinary */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Next.js gère le <title> et <meta> via metadata.js */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>

      {/* font-sans = var(--font-sans) définie par next/font */}
      <body className="flex min-h-screen flex-col bg-gray-50 font-sans">
        {/* Skip link pour clavier/lecteurs d'écran */}
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>

        <AuthProvider>
          {/* Cible du skip link ; tabIndex=-1 permet de recevoir le focus */}
          <div id="main" tabIndex={-1} className="flex-1 flex flex-col">
            {children}
          </div>

          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
