export const dynamic = "force-dynamic";

import { getAllRoomSlugs, getRoomBySlug } from "@/lib/mongodb";
import ArtworkSlider from "@/components/artwork/ArtworkSlider";
import Link from "next/link";

// SSG optionnel (tu peux garder ou retirer suivant ton besoin)
export async function generateStaticParams() {
  const slugs = await getAllRoomSlugs(); // ["salle-1", ...]
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ important
  const room = await getRoomBySlug(slug);

  const titleBase = room?.name || room?.title || slug;
  const desc =
    room?.description || "Explorez cette salle de notre musée virtuel";
  const ogImage = room?.artworks?.[0]?.imageUrl || "/assets/default-room.jpg";

  return {
    title: `${titleBase} | L'iconodule`,
    description: desc,
    openGraph: {
      title: titleBase,
      description: desc,
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

export default async function RoomPage({ params }) {
  const { slug } = await params; // ✅ important
  const room = await getRoomBySlug(slug);

  // 🔐 Sérialiser les œuvres pour un composant client
  const artworks =
    room?.artworks?.map((a) => ({
      _id:
        (a?._id && typeof a._id.toString === "function"
          ? a._id.toString()
          : a?._id) || "",
      title: a?.title || "",
      description: a?.description || "",
      imageUrl: a?.imageUrl || "",
      artist: a?.artist || "",
    })) ?? [];

  return (
    <div className="container mx-auto px-2">
      <div className="back-button-container mb-3">
        <Link href="/accueil" className="back-button text-sm sm:text-base">
          <span className="back-arrow">←</span>
          Retour à l&apos;accueil
        </Link>
      </div>

      <div className="text-center mb-1">
        <h1 className="room-page-title text-5xl sm:text-6xl md:text-7xl font-serif font-semibold text-gray-800 mb-2">
          {room?.name || room?.title || slug}
        </h1>
      </div>

      <ArtworkSlider artworks={artworks} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: room?.name || slug,
            description: room?.description || "Salle du musée virtuel",
            mainEntity: artworks[0] && {
              "@type": "VisualArtwork",
              name: artworks[0].title,
              creator: {
                "@type": "Person",
                name: artworks[0].artist || "Artiste",
              },
            },
          }),
        }}
      />
    </div>
  );
}
