import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function WithNavLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="w-full"></div>

      <main className="flex-1 pt-10">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col px-4 py-8 justify-center items-center">
            <div className="main-container w-full">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
      <div className="w-full"></div>
    </div>
  );
}
