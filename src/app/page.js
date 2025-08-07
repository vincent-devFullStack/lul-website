"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsTransitioning(true);

    setTimeout(() => {
      router.push("/accueil");
    }, 1000);
  };

  return (
    <div
      className={`h-screen relative transition-transform duration-9000 ease-in-out ${
        isTransitioning ? "scale-1000000" : "scale-100"
      }`}
      style={{
        backgroundImage: "url('/assets/hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-700 ease-in-out ${
          isTransitioning ? "opacity-60" : "opacity-0"
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
