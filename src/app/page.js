import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
        <Link href="/accueil">
            <button className="btn-enter flex justify-center items-center px-8 py-4 border-3 bg-(--brown) border-(--border-brown) text-white cursor-pointer text-6xl">Entrez</button>
        </Link>
    </div>
  );
}
