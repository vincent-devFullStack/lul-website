// ❌ PAS de "use client"
import "@/styles/base/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientWrapper from "@/components/layout/ClientWrapper";

export const metadata = {
  title: "LUL Website",
  description: "Site web moderne avec navigation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
