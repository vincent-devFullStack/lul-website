import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function WithNavLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar pleine largeur */}
      <div className="w-full">
        <Navigation />
      </div>

      {/* Contenu principal centré avec max-width */}
      <main className="flex-1 pt-10">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col px-4 py-8 justify-center items-center">
            <div className="main-container w-full">{children}</div>
          </div>
        </div>
      </main>

      {/* Footer pleine largeur */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
