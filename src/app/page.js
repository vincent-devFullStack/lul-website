"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Prefetch + respect du prefers-reduced-motion
  useEffect(() => {
    router.prefetch("/accueil");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (m) => setReducedMotion(m.matches);
    apply(mq);
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [router]);

  const handleEnter = (e) => {
    e.preventDefault();
    if (reducedMotion) return router.push("/accueil");
    setIsTransitioning(true);
    setTimeout(() => router.push("/accueil"), 700); // durée Tailwind valide
  };

  return (
    <main
      aria-labelledby="home-title"
      className={`relative min-h-screen sm:h-dvh transition-opacity duration-700 ease-out ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Image de fond décorative */}
      <Image
        src="/assets/hero.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 id="home-title" className="sr-only">
          L'Iconodule – Galerie
        </h1>

        {/* Espace sous le haut de page (valeur Tailwind valide) */}
        <div className="mt-32 sm:mt-48" aria-hidden="true" />

        <button
          type="button"
          onClick={handleEnter}
          className="enter-btn group relative rounded-full px-8 py-3 text-base font-semibold tracking-widest text-white bg-transparent border-none shadow-none transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#aa9980] focus:ring-offset-2 mt-80 sm:mt-0 cursor-pointer"
          aria-label="Entrer sur le site L'Iconodule"
        >
          Entrer
        </button>
      </div>
    </main>
  );
}
