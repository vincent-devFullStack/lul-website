export const revalidate = 900;

import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArtworkSliderClient from "@/components/artwork/ArtworkSliderClient";
import { getAllRoomSlugs, getRoomBySlug } from "@/lib/mongodb";

/** Cache par slug (ISR + tag pour revalidation ciblée via /api/revalidate-room) */
const getRoomCached = (slug) =>
  unstable_cache(() => getRoomBySlug(slug), ["room", slug], {
    revalidate,
    tags: [`room:${slug}`],
  })();

/** SSG de toutes les salles connues */
export async function generateStaticParams() {
  const slugs = await getAllRoomSlugs();
  return (slugs || []).filter(Boolean).map((slug) => ({ slug: String(slug) }));
}

/** Metadata par salle (évite d’avoir un metadata.js séparé) */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const room = await getRoomCached(slug);

  const titleBase = (room?.name || room?.title || slug || "Salle").trim();
  const desc = (
    room?.description ||
    "Explorez cette salle de notre musée virtuel L’Iconodule."
  ).slice(0, 300);

  const ogImage = room?.artworks?.[0]?.imageUrl || "/assets/default-room.jpg";
  const url = `/rooms/${encodeURIComponent(slug)}`;

  return {
    title: `${titleBase} | L’Iconodule`,
    description: desc,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${titleBase} | L’Iconodule`,
      description: desc,
      url,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${titleBase} - L’Iconodule`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleBase} | L’Iconodule`,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function RoomPage({ params }) {
  const { slug } = await params;
  const room = await getRoomCached(slug);
  if (!room) notFound();

  const artworks = (room.artworks ?? []).map((a) => ({
    _id:
      (a?._id && typeof a._id?.toString === "function"
        ? a._id.toString()
        : a?._id) || "",
    title: a?.title || "",
    description: a?.description || "",
    imageUrl: a?.imageUrl || "",
    artist: a?.artist || "",
  }));

  const title = room.name || room.title || slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: room.description || "Salle du musée virtuel",
    mainEntity: artworks[0]
      ? {
          "@type": "VisualArtwork",
          name: artworks[0].title || "Œuvre",
          creator: artworks[0].artist
            ? { "@type": "Person", name: artworks[0].artist }
            : undefined,
          image: artworks[0].imageUrl || undefined,
        }
      : undefined,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: "/accueil",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: `/rooms/${encodeURIComponent(slug)}`,
        },
      ],
    },
  };

  return (
    <main className="room-bg min-h-[100svh]">
      <div className="container mx-auto px-2">
        <div className="text-center mb-1">
          <h1 className="room-page-title text-5xl sm:text-6xl md:text-7xl font-serif font-semibold text-gray-800 mb-2">
            {title}
          </h1>
        </div>

        {/* Client wrapper qui charge le slider côté client */}
        <ArtworkSliderClient artworks={artworks} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="back-button-container">
          <Link href="/accueil" className="back-button">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
