import "@/styles/base/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientWrapper from "@/components/layout/ClientWrapper";

export const metadata = {
  title: "L'iconodule",
  description: "Découvrez le musée d'art L'iconodule",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="preload"
          href="/api/salles"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        {/* Autres meta tags, polices, etc. */}
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
