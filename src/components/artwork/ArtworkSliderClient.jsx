"use client";

import dynamic from "next/dynamic";

// Charge réellement le gros slider côté client uniquement
const Slider = dynamic(() => import("./ArtworkSlider"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
});

export default function ArtworkSliderClient({ artworks }) {
  return <Slider artworks={artworks} />;
}
