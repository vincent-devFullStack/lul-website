import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function WithNavLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-10">
        <div className="max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center items-center">
          <div className="flex flex-col container mx-auto px-4 py-8 justify-center items-center">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 