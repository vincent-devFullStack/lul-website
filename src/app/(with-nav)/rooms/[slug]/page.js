export const dynamic = "force-dynamic";

import { getAllRoomSlugs, getRoomBySlug } from "@/lib/mongodb";
import ArtworkSlider from "@/components/artwork/ArtworkSlider";
import Link from "next/link";

export async function generateStaticParams() {
  const slugs = await getAllRoomSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function RoomPage(props) {
  const { slug } = await props.params;
  const room = await getRoomBySlug(slug);

  return (
    <div className="container mx-auto px-4">
      {/* ✅ AJOUT : Bouton de retour */}
      <div className="back-button-container mb-6">
        <Link href="/" className="back-button">
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
    </div>
  );
}
