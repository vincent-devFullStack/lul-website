import "../styles/base/globals.css";
import "@/styles/base/globals.css";

export const metadata = {
  title: "LUL Website",
  description: "Site web moderne avec navigation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 w-full">
        <main>{children}</main>
      </body>
    </html>
  );
}
