import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Link href="/accueil">
        <button
          className="
    text-6xl 
    text-[#5B4636]
    bg-transparent 
    border-0 
    cursor-pointer 
    transition-colors 
    duration-300 
    hover:text-[#8B6E4E]
  "
        >
          Entrez
        </button>
      </Link>
    </div>
  );
}
