"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import "../../styles/components/Artworkslider.css"; // ← vérifie la casse exacte

/** Optimise une URL Cloudinary: format & qualité auto + limite largeur */
function cldOptimize(url, w = 1600) {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com"))
    return url ?? "";
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,c_limit,w_${w}/`
  );
}

/**
 * @typedef {Object} Artwork
 * @property {string} [_id]
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [imageUrl]
 */

export default function ArtworkSlider({ artworks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(""); // "", "slide-left" | "slide-right"
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const animTimeoutRef = useRef(
    /** @type {ReturnType<typeof setTimeout> | null} */ (null)
  );

  const optimizedArtworks = useMemo(
    () =>
      artworks.map((a) => ({ ...a, _optUrl: cldOptimize(a?.imageUrl, 1600) })),
    [artworks]
  );
  const len = optimizedArtworks.length;

  // Si la liste change et que l'index sort de la plage, on le recale.
  useEffect(() => {
    if (len === 0) return;
    setCurrentIndex((i) => (i >= len ? len - 1 : Math.max(0, i)));
  }, [len]);

  const endAnimation = useCallback(() => {
    setIsAnimating(false);
    setSlideDirection("");
    animTimeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  const previous = useCallback(() => {
    if (isAnimating || !len) return;
    setIsAnimating(true);
    setSlideDirection("slide-right");
    setCurrentIndex((prev) => (prev === 0 ? len - 1 : prev - 1));
    animTimeoutRef.current = setTimeout(endAnimation, 500);
  }, [isAnimating, len, endAnimation]);

  const next = useCallback(() => {
    if (isAnimating || !len) return;
    setIsAnimating(true);
    setSlideDirection("slide-left");
    setCurrentIndex((prev) => (prev === len - 1 ? 0 : prev + 1));
    animTimeoutRef.current = setTimeout(endAnimation, 500);
  }, [isAnimating, len, endAnimation]);

  // Accessibilité : navigation clavier
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") previous();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previous, next]);

  // Gestes (Pointer Events uniquement)
  const SWIPE_THRESHOLD = 50;
  const MAX_DRAG = 120;

  const onPointerDown = (e) => {
    if (isAnimating) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setDragX(0);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    // bloque si le geste est plus vertical qu’horizontal (laisser scroller la page)
    if (Math.abs(e.clientY - startY) > Math.abs(e.clientX - startX)) return;
    const dx = Math.max(Math.min(e.clientX - startX, MAX_DRAG), -MAX_DRAG);
    setDragX(dx);
  };

  const onPointerUpOrCancel = () => {
    if (!isDragging) return;
    const dx = dragX;
    setIsDragging(false);
    setDragX(0);
    if (Math.abs(dx) >= SWIPE_THRESHOLD) (dx < 0 ? next : previous)();
  };

  if (!len) {
    return (
      <p className="text-center text-gray-600">Aucune œuvre à afficher.</p>
    );
  }

  const currentArtwork = optimizedArtworks[currentIndex];
  const currentSrc = currentArtwork?._optUrl || "/fallback.webp";
  const isFirst = currentIndex === 0;

  if (!currentArtwork?.imageUrl) {
    return <div className="room-picture bg-transparent" />;
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Galerie d’œuvres"
      className="w-full flex flex-col items-center justify-center relative py-12"
    >
      <div className="relative flex items-center justify-center">
        <button
          className={`previous-button ${isAnimating ? "clicked" : ""}`}
          onClick={previous}
          disabled={isAnimating}
          aria-label="Œuvre précédente"
          type="button"
        />

        {/* Boîte avec ratio pour éviter le CLS */}
        <div
          className={`room-picture ${slideDirection} ${isDragging ? "dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
          // petit offset visuel pendant le drag (optionnel ; n’altère pas ton CSS)
          style={
            isDragging ? { transform: `translateX(${dragX}px)` } : undefined
          }
        >
          <Image
            key={currentIndex}
            src={currentSrc}
            alt={currentArtwork?.title || "Œuvre sans titre"}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            style={{ objectFit: "contain" }}
            priority={isFirst}
            fetchPriority={isFirst ? "high" : "auto"}
            draggable={false}
          />
        </div>

        <button
          className={`next-button ${isAnimating ? "clicked" : ""}`}
          onClick={next}
          disabled={isAnimating}
          aria-label="Œuvre suivante"
          type="button"
        />
      </div>
      <div
        className="flex justify-center mt-4 gap-2"
        role="tablist"
        aria-label="Pagination des œuvres"
      >
        {optimizedArtworks.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            role="tab"
            aria-selected={currentIndex === i ? "true" : "false"}
            aria-label={`Aller à l’œuvre ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-opacity ${
              currentIndex === i
                ? "opacity-60 bg-white dark:bg-white"
                : "opacity-40 bg-black dark:bg-white"
            }`}
          />
        ))}
      </div>
      <div
        className={`artwork-info ${slideDirection}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <h2 className="artwork-title">{currentArtwork?.title}</h2>
        <div className="artwork-description">{currentArtwork?.description}</div>
      </div>
    </section>
  );
}
