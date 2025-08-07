"use client";

import { useState } from "react";
import Image from "next/image";
import "../../styles/components/Artworkslider.css";

export default function ArtworkSlider({ artworks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");

  if (!artworks || artworks.length === 0) {
    return (
      <p className="text-center text-gray-600">Aucune œuvre à afficher.</p>
    );
  }

  const previous = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSlideDirection("slide-right");
    setCurrentIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));

    setTimeout(() => {
      setIsAnimating(false);
      setSlideDirection("");
    }, 500);
  };

  const next = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSlideDirection("slide-left");
    setCurrentIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));

    setTimeout(() => {
      setIsAnimating(false);
      setSlideDirection("");
    }, 500);
  };

  const currentArtwork = artworks[currentIndex];

  if (!currentArtwork?.imageUrl) {
    return (
      <p className="text-center text-red-600">
        Image manquante pour cette œuvre.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center relative py-12">
      <div className="relative flex items-center justify-center">
        <button
          className={`previous-button ${isAnimating ? "clicked" : ""}`}
          onClick={previous}
          disabled={isAnimating}
        ></button>

        <div className={`room-picture ${slideDirection}`}>
          <Image
            src={currentArtwork.imageUrl || "/fallback.webp"}
            alt={currentArtwork.title || "Œuvre sans titre"}
            fill
            style={{ objectFit: "contain" }}
            priority
            key={currentIndex}
          />
        </div>

        <button
          className={`next-button ${isAnimating ? "clicked" : ""}`}
          onClick={next}
          disabled={isAnimating}
        ></button>
      </div>

      <div className={`artwork-info ${slideDirection}`}>
        <h2 className="artwork-title">{currentArtwork.title}</h2>
        <div className="artwork-description">{currentArtwork.description}</div>
      </div>
    </div>
  );
}
