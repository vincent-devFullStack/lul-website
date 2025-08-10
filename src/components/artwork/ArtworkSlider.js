"use client";

import { useState } from "react";
import Image from "next/image";
import "../../styles/components/Artworkslider.css";

export default function ArtworkSlider({ artworks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

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
  // Swipe/drag mobile + pointer
  const SWIPE_THRESHOLD = 50; // px
  const MAX_DRAG = 120; // limite visuelle

  const startDrag = (x, y) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartX(x);
    setStartY(y);
    setDragX(0);
  };

  const moveDrag = (x, y) => {
    if (!isDragging) return;
    // ignore si le geste est plus vertical qu'horizontal
    if (Math.abs(y - startY) > Math.abs(x - startX)) return;
    const dx = Math.max(Math.min(x - startX, MAX_DRAG), -MAX_DRAG);
    setDragX(dx);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const dx = dragX;
    setIsDragging(false);
    setDragX(0);
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) next();
    else previous();
  };

  const onPointerDown = (e) => startDrag(e.clientX, e.clientY);
  const onPointerMove = (e) => moveDrag(e.clientX, e.clientY);
  const onPointerUp = () => endDrag();
  const onPointerCancel = () => endDrag();

  const onTouchStart = (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };
  const onTouchMove = (e) => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  };
  const onTouchEnd = () => endDrag();

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
          aria-label="Œuvre précédente"
        ></button>

        <div
          className={`room-picture ${slideDirection} ${isDragging ? "dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: isDragging ? `translateX(${dragX}px)` : undefined,
            transition: isDragging ? "none" : undefined,
            touchAction: "pan-y", // laisse le scroll vertical
          }}
        >
          <Image
            src={currentArtwork.imageUrl || "/fallback.webp"}
            alt={currentArtwork.title || "Œuvre sans titre"}
            fill
            style={{ objectFit: "contain" }}
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            key={currentIndex}
          />
        </div>

        <button
          className={`next-button ${isAnimating ? "clicked" : ""}`}
          onClick={next}
          disabled={isAnimating}
          aria-label="Œuvre suivante"
        ></button>
      </div>

      {/* Texte en dessous conservé */}
      <div className={`artwork-info ${slideDirection}`}>
        <h2 className="artwork-title">{currentArtwork.title}</h2>
        <div className="artwork-description">{currentArtwork.description}</div>
      </div>
    </div>
  );
}
