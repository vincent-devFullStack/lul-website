import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function WithNavLayout({ children }) {
  return (
    <>
      <Navigation />
      <main className="h-full flex pt-16 min-h-screen justify-center items-center">
        {children}
      </main>
      <Footer />
    </>
  );
} 