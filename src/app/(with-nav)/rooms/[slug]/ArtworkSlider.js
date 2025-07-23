"use client";

import { useState } from "react";
import Image from "next/image";

export default function ArtworkSlider() {
  const artworks = [
    { id: 1, title: "Titre de l’œuvre 1", imageUrl: "/assets/Collage.jpg" },
    { id: 2, title: "Titre de l’œuvre 2", imageUrl: "/assets/artwork2.webp" },
    { id: 3, title: "Titre de l’œuvre 3", imageUrl: "/assets/artwork3.webp" },
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
    <div
      className="relative w-full flex flex-col items-center"
      style={{ height: "80vh" }}
    >
      <div className="max-w-3xl w-full h-full flex flex-col justify-center items-center relative">
        <Image
          src={artworks[currentIndex].imageUrl}
          alt={artworks[currentIndex].title}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-lg"
          priority
        />
        <p className="mt-4 text-center text-base font-serif text-darkbrown">
          {artworks[currentIndex].title}
        </p>

        <button
          onClick={previous}
          className="absolute left-[-30%] top-1/2 transform -translate-y-1/2 p-2 rounded bg-lightbrown bg-opacity-50 hover:bg-opacity-80"
          aria-label="Image précédente"
        >
          <Image
            src="/assets/left.webp"
            alt="Précédent"
            width={96}
            height={96}
          />
        </button>
        <button
          onClick={next}
          className="absolute right-[-30%] top-1/2 transform -translate-y-1/2 p-2 rounded bg-lightbrown bg-opacity-50 hover:bg-opacity-80"
          aria-label="Image suivante"
        >
          <Image
            src="/assets/right.webp"
            alt="Suivant"
            width={96}
            height={96}
          />
        </button>
      </div>
    </div>
  );
}
