// page.js
import ArtworkSlider from "./ArtworkSlider";
import "./Artworkslider.css";
export default function RoomPage({ params }) {
  const { slug } = params;

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
            {slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
        </div>
        
        <ArtworkSlider />
      </div>
  );
}
