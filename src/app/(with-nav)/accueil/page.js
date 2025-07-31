"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AccueilPlanInteractif() {
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Affiche une alerte si l’utilisateur est sur mobile
  useEffect(() => {
    if (window.innerWidth < 770) {
      alert(
        "Ce site est conçu pour une expérience optimale sur PC.\nMerci de revenir depuis un ordinateur."
      );
    }
  }, []);

  // Charge les données des salles depuis l'API
  useEffect(() => {
    const fetchSalles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/salles");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des salles");
        }

        const data = await response.json();
        // Tri par displayOrder pour garantir l'ordre
        const sortedSalles = data.sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
        setSalles(sortedSalles);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors du chargement des salles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalles();
  }, []);

  const handleMouseEnter = (salle, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      content: salle,
      x: rect.right + 10,
      y: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: "", x: 0, y: 0 });
  };

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du plan du musée...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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

      {salles.map((salle) => {
        const { _id, slug, name, description, coordinates, status } = salle;
        const { top, left, width, height } = coordinates;
        const isGeneric = /^S\.\d+$/.test(name);
        const displayText = isGeneric ? "" : name;

        return (
          <Link
            key={_id}
            href={`/rooms/${slug}`}
            aria-label={`${name} - ${description}`}
            role="button"
            tabIndex={0}
            className={`absolute cursor-pointer bg-transparent flex justify-center items-center text-black font-semibold text-xs transition-all duration-200 ${
              status === "restricted" ? "opacity-70" : ""
            }`}
            style={{ top, left, width, height }}
            onMouseEnter={(e) => handleMouseEnter(salle, e)}
            onMouseLeave={handleMouseLeave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                window.location.href = `/rooms/${slug}`;
              }
            }}
          >
            {displayText && (
              <span className="room-label text-center text-[#2a231a] px-2 py-1 transition-transform duration-200 scale-[0.9] hover:scale-110 break-words">
                {displayText}
              </span>
            )}
          </Link>
        );
      })}

      {/* Tooltip Component - Position fixe pour éviter les problèmes de scroll */}
      {tooltip.show && (
        <div
          className="fixed z-[999] bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700 max-w-sm pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 25}px`,
            transform: "translateY(-50%)",
          }}
        >
          <div className="font-semibold text-sm mb-1">
            {tooltip.content.name}
          </div>
          <div className="text-xs text-gray-300">
            {tooltip.content.description}
          </div>
          {tooltip.content.status === "restricted" && (
            <div className="text-xs text-yellow-400 mt-1">
              ⚠️ Accès restreint
            </div>
          )}
          {/* Petite flèche */}
          <div
            className="absolute w-2 h-2 bg-gray-900 border-l border-b border-gray-700 transform rotate-45"
            style={{
              left: "-4px",
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
            }}
          />
        </div>
      )}
    </div>
  );
}
