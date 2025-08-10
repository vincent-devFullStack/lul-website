"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import NextImage from "next/image";
import "../../styles/components/Artworkslider.css";

/** Optimise une URL Cloudinary: format & qualité automatiques + limite de largeur */
function cldOptimize(url, w = 1600) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,c_limit,w_${w}/`
  );
}

export default function ArtworkSlider({ artworks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  // URLs optimisées (Cloudinary) mémoïsées
  const optimizedArtworks = useMemo(
    () =>
      (artworks || []).map((a) => ({
        ...a,
        _optUrl: cldOptimize(a?.imageUrl, 1600),
      })),
    [artworks]
  );

  const len = optimizedArtworks.length;

  if (!len) {
    return (
      <p className="text-center text-gray-600">Aucune œuvre à afficher.</p>
    );
  }

  const previous = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("slide-right");
    setCurrentIndex((prev) => (prev === 0 ? len - 1 : prev - 1));
    setTimeout(() => {
      setIsAnimating(false);
      setSlideDirection("");
    }, 500);
  }, [isAnimating, len]);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("slide-left");
    setCurrentIndex((prev) => (prev === len - 1 ? 0 : prev + 1));
    setTimeout(() => {
      setIsAnimating(false);
      setSlideDirection("");
    }, 500);
  }, [isAnimating, len]);

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

  // Pré-chargement de l’image suivante et précédente
  useEffect(() => {
    if (len < 2) return;
    const nextIdx = (currentIndex + 1) % len;
    const prevIdx = (currentIndex - 1 + len) % len;

    [nextIdx, prevIdx].forEach((i) => {
      const u = optimizedArtworks[i]?._optUrl;
      if (!u) return;
      // ⚠️ utiliser le constructeur natif du navigateur,
      // pas le composant Next.js
      const img = new window.Image();
      img.src = u; // warm HTTP cache
    });
  }, [currentIndex, len, optimizedArtworks]);

  const currentArtwork = optimizedArtworks[currentIndex];
  const currentSrc = currentArtwork?._optUrl || "/fallback.webp";
  const isFirst = currentIndex === 0;

  return (
    <div className="w-full flex flex-col items-center justify-center relative py-12">
      <div className="relative flex items-center justify-center">
        <button
          className={`previous-button ${isAnimating ? "clicked" : ""}`}
          onClick={previous}
          disabled={isAnimating}
          aria-label="Œuvre précédente"
        />

        <div
          className={`room-picture ${slideDirection} ${
            isDragging ? "dragging" : ""
          }`}
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
            touchAction: "pan-y",
          }}
        >
          <NextImage
            key={currentIndex}
            src={currentSrc}
            alt={currentArtwork?.title || "Œuvre sans titre"}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 1024px) 100vw, 900px"
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
        />
      </div>

      <div className={`artwork-info ${slideDirection}`}>
        <h2 className="artwork-title">{currentArtwork?.title}</h2>
        <div className="artwork-description">{currentArtwork?.description}</div>
      </div>
    </div>
  );
}
