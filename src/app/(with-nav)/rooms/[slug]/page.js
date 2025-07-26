export const dynamic = "force-dynamic";

import { getAllRoomSlugs, getRoomBySlug } from "@/lib/mongodb";
import ArtworkSlider from "@/components/artwork/ArtworkSlider";

export async function generateStaticParams() {
  const slugs = await getAllRoomSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function RoomPage(props) {
  const { slug } = await props.params; // ✅ destructuration asynchrone
  const room = await getRoomBySlug(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          {room?.title ||
            slug.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
      </div>
      <ArtworkSlider artworks={room?.artworks || []} />
    </div>
  );
}
