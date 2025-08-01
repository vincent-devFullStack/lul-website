"use client";

import { useState } from "react";
import Image from "next/image";
import "../../styles/components/Artworkslider.css";

export default function ArtworkSlider({ artworks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!artworks || artworks.length === 0) {
    return (
      <p className="text-center text-gray-600">Aucune œuvre à afficher.</p>
    );
  }

  const previous = () =>
    setCurrentIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));

  const next = () =>
    setCurrentIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));

  const currentArtwork = artworks[currentIndex];

  // Sécurité supplémentaire si les champs sont manquants
  if (!currentArtwork?.imageUrl) {
    return (
      <p className="text-center text-red-600">
        Image manquante pour cette œuvre.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center relative py-12">
      {/* Section image avec flèches */}
      <div className="relative flex items-center justify-center">
        <button className="previous-button" onClick={previous}>
          <span className="sr-only">Précédent</span>
        </button>

        <div className="room-picture">
          <Image
            src={currentArtwork.imageUrl || "/fallback.webp"}
            alt={currentArtwork.title || "Œuvre sans titre"}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <button className="next-button" onClick={next}>
          <span className="sr-only">Suivant</span>
        </button>
      </div>

      {/* Section information */}
      <div className="artwork-info">
        <h2 className="artwork-title">{currentArtwork.title}</h2>
        <div className="artwork-description">{currentArtwork.description}</div>
      </div>
    </div>
  );
}
