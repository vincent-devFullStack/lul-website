import { AuthProvider } from "@/context/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import "@/styles/base/globals.css";

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
  alternates: { canonical: "https://www.iconodule.fr" }, // (petit bonus SEO)
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

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Pré-connexion / DNS-prefetch vers Cloudinary pour gagner ~100–200ms au 1er hit */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
