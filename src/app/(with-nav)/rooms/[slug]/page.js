// src/app/(with-nav)/rooms/[slug]/page.js
export const dynamic = "force-dynamic";

import { getAllRoomSlugs, getRoomBySlug } from "@/lib/mongodb";
import ArtworkSlider from "@/components/artwork/ArtworkSlider";
import Link from "next/link";

// --- SSG des slugs ---
export async function generateStaticParams() {
  const slugs = await getAllRoomSlugs();
  return slugs.map((slug) => ({ slug }));
}

// --- <head> dynamique ---
export async function generateMetadata({ params }) {
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  const titleBase = room?.name || room?.title || slug;
  const description =
    room?.description || "Explorez cette salle de notre musée virtuel";
  const ogImage = room?.artworks?.[0]?.imageUrl || "/assets/default-room.jpg";

  return {
    title: `${titleBase} | L'iconodule`,
    description,
    openGraph: {
      title: titleBase,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${titleBase} - L'iconodule`,
        },
      ],
    },
  };
}

// --- Page ---
export default async function RoomPage({ params }) {
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  // ✅ rendre les œuvres sérialisables pour le composant client
  const artworks = (room?.artworks ?? []).map((a) => ({
    id:
      a?._id?.toString?.() ??
      (typeof a?._id !== "undefined" ? String(a._id) : ""),
    title: a?.title ?? "",
    description: a?.description ?? "",
    imageUrl: a?.imageUrl ?? "",
    // ajoute d'autres champs PRIMITIFS si besoin
  }));

  const titleBase = room?.name || room?.title || slug;

  // JSON-LD propre (pas d’ObjectId / fonctions)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: titleBase,
    description: room?.description || "Salle du musée virtuel",
  };

  if (artworks[0]) {
    jsonLd.mainEntity = {
      "@type": "VisualArtwork",
      name: artworks[0].title || titleBase,
      creator: {
        "@type": "Person",
        name: room?.artworks?.[0]?.artist || "Artiste",
      },
      image: artworks[0].imageUrl || undefined,
    };
  }

  return (
    <div className="container mx-auto px-2">
      <div className="back-button-container mb-3">
        <Link href="/accueil" className="back-button text-sm sm:text-base">
          <span className="back-arrow">←</span>
          Retour à l'accueil
        </Link>
      </div>

      <div className="text-center mb-1">
        <h1 className="room-page-title text-5xl sm:text-6xl md:text-7xl font-serif font-semibold text-gray-800 mb-2">
          {titleBase}
        </h1>
      </div>

      <ArtworkSlider artworks={artworks} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </div>
  );
}
