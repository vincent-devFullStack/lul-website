// page.js
import ArtworkSlider from "./ArtworkSlider";

export default function RoomPage({ params }) {
  const { slug } = params;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-beige p-4">
      <h1 className="mb-8 text-2xl font-semibold">
        Détails de la salle : {slug}
      </h1>
      <ArtworkSlider />
    </div>
  );
}
