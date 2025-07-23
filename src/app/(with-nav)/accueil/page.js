"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AccueilPlanInteractif() {
  const salles = [
    { id: 1, top: "20%", left: "3%", width: "16%", height: "24%" },
    { id: 2, top: "22%", left: "44%", width: "17%", height: "22%" },
    { id: 3, top: "51%", left: "44%", width: "10%", height: "22%" },
    { id: 4, top: "75%", left: "44%", width: "10%", height: "22%" },
    { id: 5, top: "21%", left: "20%", width: "3%", height: "28%" },
    { id: 6, top: "47%", left: "3%", width: "8%", height: "15%" },
    { id: 7, top: "56%", left: "36%", width: "7%", height: "30%" },
    { id: 8, top: "51%", left: "55%", width: "5%", height: "9%" },
    { id: 9, top: "62%", left: "55%", width: "5%", height: "20%" },
    { id: 10, top: "85%", left: "55%", width: "5%", height: "13%" },
    { id: 11, top: "52%", left: "61%", width: "6%", height: "9%" },
    { id: 12, top: "36%", left: "61.5%", width: "6%", height: "9%" },
    { id: 13, top: "23%", left: "61.5%", width: "6%", height: "12%" },
    { id: 14, top: "46%", left: "68%", width: "5%", height: "14%" },
    { id: 15, top: "45%", left: "74%", width: "11%", height: "14%" },
    { id: 16, top: "45%", left: "85.5%", width: "5.5%", height: "14%" },
    { id: 17, top: "44%", left: "91.8%", width: "4.5%", height: "14%" },
  ];

  useEffect(() => {
    if (window.innerWidth < 770) {
      alert(
        "Ce site est conçu pour une expérience optimale sur PC.\nMerci de revenir depuis un ordinateur."
      );
    }
  }, []);

  return (
    <div
      className="plan-container"
      style={{ position: "relative", margin: "0 auto" }}
    >
      <Image
        src="/assets/plan.webp"
        alt="Plan du musée"
        fill
        style={{ objectFit: "contain" }}
        priority
      />

      {salles.map(({ id, top, left, width, height }) => (
        <Link
          key={id}
          href={`/rooms/salle-${id}`}
          aria-label={`Salle ${id}`}
          role="button"
          tabIndex={0}
          className="absolute cursor-pointer bg-transparent flex justify-center items-center text-black font-semibold"
          style={{ top, left, width, height }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              window.location.href = `/rooms/salle-${id}`;
            }
          }}
        >
          {id === 10 ? "S. 10" : `Salle ${id}`}
        </Link>
      ))}
    </div>
  );
}
