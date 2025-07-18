import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="btn-enter flex justify-center items-center px-8 py-4 border-3 bg-(--brown) border-(--border-brown) text-xl text-white">
        <Link href="/accueil">
          <button className="text-6xl text-white">Entrez</button>
        </Link>
      </div>
    </div>
  );
}
