"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ détection mobile

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    setIsTransitioning(true);

    setTimeout(
      () => {
        router.push("/accueil");
      },
      isMobile ? 500 : 800
    );
  };

  return (
    <div
      className={`relative overflow-hidden transition-transform duration-700 ease-out ${
        isTransitioning
          ? isMobile
            ? "scale-100"
            : "scale-105"
          : isMobile
            ? "scale-98"
            : "scale-100" // ✅ réduction sur mobile
      } ${isMobile ? "h-[100svh]" : "h-screen"}`}
      style={{
        backgroundImage: "url('/assets/hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: isMobile ? "top center" : "center", // ✅ cadrage mobile
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out ${
          isTransitioning ? "opacity-50" : "opacity-0"
        }`}
        style={{ zIndex: 10 }}
      />

      <div
        className="absolute inset-0 block z-20"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="w-full h-full"></div>
      </div>
    </div>
  );
}
