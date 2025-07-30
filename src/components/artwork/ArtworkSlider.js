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
    <div className="w-full flex flex-col justify-center items-center relative py-12">
      <div className="relative flex items-center justify-center">
        <button
          onClick={previous}
          className="previous-button"
          aria-label="Image précédente"
        >
          <span className="sr-only">Précédent</span>
        </button>

        <div className="room-picture">
          <Image
            src={currentArtwork.imageUrl || "/fallback.webp"} // fallback en cas d'erreur
            alt={currentArtwork.title || "Œuvre sans titre"}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <button
          onClick={next}
          className="next-button"
          aria-label="Image suivante"
        >
          <span className="sr-only">Suivant</span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-serif text-gray-800">
          {currentArtwork.title || "Titre inconnu"}
        </h2>
        {currentArtwork.description && (
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            {currentArtwork.description}
          </p>
        )}
        
        {/* Indicateurs de navigation si plusieurs œuvres */}
        {artworks.length > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {artworks.map((artwork, index) => (
              <button
                key={artwork._id || `artwork-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-gray-800' 
                    : 'bg-gray-300 hover:bg-gray-500'
                }`}
                aria-label={`Aller à l'œuvre ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
