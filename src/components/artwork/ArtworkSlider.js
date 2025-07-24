"use client";

import { useState } from "react";
import Image from "next/image";
import "../styles/components/Artworkslider.css";

export default function ArtworkSlider() {
  const artworks = [
    { id: 1, title: "Titre de l'œuvre 1", imageUrl: "/assets/Collage.jpg" },
    { id: 2, title: "Titre de l'œuvre 2", imageUrl: "/assets/artwork2.webp" },
    { id: 3, title: "Titre de l'œuvre 3", imageUrl: "/assets/artwork3.webp" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const previous = () =>
    setCurrentIndex((oldIndex) =>
      oldIndex === 0 ? artworks.length - 1 : oldIndex - 1
    );
  const next = () =>
    setCurrentIndex((oldIndex) =>
      oldIndex === artworks.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <div className="w-full flex flex-col justify-center items-center relative py-12">
      {/* Container principal centré */}
      <div className="relative flex items-center justify-center">
        {/* Bouton précédent */}
        <button
          onClick={previous}
          className="previous-button"
          aria-label="Image précédente"
        >
          <span className="sr-only">Précédent</span>
        </button>

        {/* Container de l'image */}
        <div className="room-picture">
          <Image
            src={artworks[currentIndex].imageUrl}
            alt={artworks[currentIndex].title}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Bouton suivant */}
        <button
          onClick={next}
          className="next-button"
          aria-label="Image suivante"
        >
          <span className="sr-only">Suivant</span>
        </button>
      </div>

      {/* Titre de l'œuvre */}
      <div className="mt-8">
        <h2 className="text-xl font-serif text-center text-gray-800">
          {artworks[currentIndex].title}
        </h2>
      </div>
    </div>
  );
}
