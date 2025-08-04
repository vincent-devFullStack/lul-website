"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccueilPlanInteractif() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Affiche une alerte si l'utilisateur est sur mobile
  useEffect(() => {
    if (window.innerWidth < 770) {
      alert(
        "Ce site est conçu pour une expérience optimale sur PC.\nMerci de revenir depuis un ordinateur."
      );
    }
  }, []);

  // Optimisation du chargement des salles
  useEffect(() => {
    const fetchSalles = async () => {
      if (initialized) return;

      try {
        setLoading(true);
        const response = await fetch("/api/salles", {
          cache: "force-cache",
          next: { revalidate: 3600 },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des salles");
        }

        const data = await response.json();
        const sortedSalles = data.sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
        setSalles(sortedSalles);
        setInitialized(true);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalles();
  }, [initialized]);

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

  const handleRoomClick = (e, slug) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTooltip({ show: false, content: "", x: 0, y: 0 });

    setTimeout(() => {
      router.push(`/rooms/${slug}`);
    }, 600);
  };

  const sortedAndFilteredSalles = useMemo(() => {
    return salles.map((salle) => {
      const { _id, slug, name, description, coordinates, status } = salle;
      const isGeneric = /^S\.\d+$/.test(name);
      return {
        ...salle,
        displayText: isGeneric ? "" : name,
        isGeneric,
      };
    });
  }, [salles]);

  // ✅ Pas d'affichage de chargement, retourne null pendant le loading
  if (loading) {
    return null;
  }

  return (
    <>
      <div
        className="plan-container"
        style={{ position: "relative", margin: "0 auto" }}
      >
        {/* ✅ Seul l'overlay de sortie reste pour les transitions entre pages */}
        <div
          className={`fixed inset-0 transition-opacity duration-600 ease-in-out pointer-events-none ${
            isTransitioning ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundColor: "#e3d4b4",
            zIndex: 9999,
          }}
        />

        <Image
          src="/assets/plan.webp"
          alt="Plan du musée"
          fill
          style={{ objectFit: "contain" }}
          priority={true}
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          quality={95}
          placeholder="empty"
        />

        <div>
          {sortedAndFilteredSalles.map((salle) => {
            const {
              _id,
              slug,
              name,
              description,
              coordinates,
              status,
              displayText,
            } = salle;
            const { top, left, width, height } = coordinates;

            if (status === "maintenance") {
              return (
                <div
                  key={_id}
                  aria-label={`${name} - ${description}`}
                  className="absolute flex justify-center items-center text-black font-semibold text-xs transition-all duration-200 opacity-60 cursor-not-allowed"
                  style={{ top, left, width, height }}
                  onMouseEnter={(e) => handleMouseEnter(salle, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => e.preventDefault()}
                  tabIndex={-1}
                >
                  {displayText && (
                    <span className="room-label text-center text-[#2a231a] px-2 py-1 transition-transform duration-200 scale-[0.9] break-words">
                      {displayText}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <div
                key={_id}
                aria-label={`${name} - ${description}`}
                role="button"
                tabIndex={0}
                className="absolute cursor-pointer bg-transparent flex justify-center items-center text-black font-semibold text-xs transition-all duration-200"
                style={{ top, left, width, height }}
                onMouseEnter={(e) => handleMouseEnter(salle, e)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleRoomClick(e, slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRoomClick(e, slug);
                  }
                }}
              >
                {displayText && (
                  <span className="room-label text-center text-[#2a231a] px-2 py-1 transition-transform duration-200 scale-[0.9] hover:scale-110 break-words">
                    {displayText}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tooltip Component */}
        {tooltip.show && !isTransitioning && (
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
            {tooltip.content.status === "maintenance" && (
              <div className="text-xs text-orange-400 mt-1">
                🛠️ Salle en maintenance
              </div>
            )}
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
    </>
  );
}
