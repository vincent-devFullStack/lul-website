"use client";

import dynamic from "next/dynamic";

const Slider = dynamic(() => import("./ArtworkSlider"), {
  ssr: false,
  loading: () => (
    <div
      className="animate-pulse"
      style={{
        width: "min(90vw, 900px)",
        aspectRatio: "3 / 4",
        borderRadius: 8,
        background: "transparent", // ou background: "#e3d3b2" selon ta couleur
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Chargement du diaporama d’œuvres"
    />
  ),
});

export default function ArtworkSliderClient({ artworks = [] }) {
  return <Slider artworks={artworks} />;
}
