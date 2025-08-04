export const dynamic = "force-dynamic";

import { getAllRoomSlugs, getRoomBySlug } from "@/lib/mongodb";
import ArtworkSlider from "@/components/artwork/ArtworkSlider";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const slugs = await getAllRoomSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  return {
    title: `${room?.name || room?.title} | L'iconodule`,
    description:
      room?.description || "Explorez cette salle de notre musée virtuel",
    openGraph: {
      title: `${room?.name || room?.title}`,
      description: room?.description,
      images: [
        {
          url: room?.artworks?.[0]?.imageUrl || "/assets/default-room.jpg",
          width: 1200,
          height: 630,
          alt: `${room?.name || room?.title} - L'iconodule`,
        },
      ],
    },
  };
}

export default async function RoomPage(props) {
  const { slug } = await props.params;
  const room = await getRoomBySlug(slug);

  return (
    <div className="container mx-auto px-4">
      {/* ✅ AJOUT : Bouton de retour */}
      <div className="back-button-container mb-6">
        <Link href="/accueil" className="back-button">
          <span className="back-arrow">←</span>
          Retour à l'accueil
        </Link>
      </div>

      <div className="text-center mb-4">
        <h1 className="room-page-title text-3xl font-serif font-semibold text-gray-800 mb-2">
          {room?.name || room?.title || slug}
        </h1>
      </div>
      <ArtworkSlider artworks={room?.artworks || []} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: room.name,
            description: room.description,
            mainEntity: room?.artworks?.[0] && {
              "@type": "VisualArtwork",
              name: room.artworks[0].title,
              creator: {
                "@type": "Person",
                name: room.artworks[0].artist || "Artiste",
              },
            },
          }),
        }}
      />
      {room?.artworks?.map((artwork, index) => (
        <Image
          key={artwork._id}
          src={artwork.imageUrl}
          alt={`${
            artwork.title
          } - ${artwork.description?.substring(0, 50) || "Œuvre d'art"}`}
          width={800}
          height={600}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
