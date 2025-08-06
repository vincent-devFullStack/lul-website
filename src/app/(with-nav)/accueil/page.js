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
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Utilise le breakpoint lg de Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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

  // Composant Liste Mobile des Salles
  const MobileRoomsList = () => (
    <div className="lg:hidden min-h-screen border-1 border-[var(--brown)] rounded-lg bg-gradient-to-b from-[var(--header-background)] to-[var(--login-background)] w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-4 px-2">
            Explorez les Salles du Musée
          </h1>
          <p className="text-[var(--foreground)] opacity-80 px-2">
            Découvrez nos collections en visitant chaque salle
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAndFilteredSalles
            .filter(salle => salle.status !== "maintenance")
            .map((salle) => (
              <div
                key={salle._id}
                onClick={(e) => handleRoomClick(e, salle.slug)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 cursor-pointer border border-[rgba(191,167,106,0.2)] hover:border-[var(--brown)] transform hover:scale-[1.02] w-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-2 break-words">
                      {salle.name}
                    </h3>
                    <p className="text-sm text-[var(--foreground)] opacity-70 mb-3 break-words">
                      {salle.description}
                    </p>
                    <div className="flex items-center text-xs text-[var(--brown)] font-medium">
                      <span>Visiter la salle</span>
                      <svg className="w-4 h-4 ml-2 transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Indicateur visuel pour les salles avec œuvres */}
                  {salle.artworks && salle.artworks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[rgba(191,167,106,0.2)]">
                      <div className="flex items-center text-xs text-[var(--brown)]">
                        <div className="w-2 h-2 bg-[var(--brown)] rounded-full mr-2 flex-shrink-0"></div>
                        <span className="break-words">
                          {salle.artworks.length} œuvre{salle.artworks.length > 1 ? 's' : ''} à découvrir
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Salles en maintenance */}
        {sortedAndFilteredSalles.some(salle => salle.status === "maintenance") && (
          <div className="mt-8 w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-4 px-2">
              Salles temporairement fermées
            </h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {sortedAndFilteredSalles
                .filter(salle => salle.status === "maintenance")
                .map((salle) => (
                  <div
                    key={salle._id}
                    className="bg-gray-100 rounded-lg p-4 opacity-60 w-full"
                  >
                    <h3 className="text-base font-medium text-gray-600 mb-1 break-words">
                      {salle.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 break-words">
                      {salle.description}
                    </p>
                    <div className="flex items-center text-xs text-orange-600">
                      <span>🛠️ Salle en maintenance</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
      {/* Overlay de transition global */}
      <div
        className={`fixed inset-0 transition-opacity duration-600 ease-in-out pointer-events-none ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundColor: "#e3d4b4",
          zIndex: 9999,
        }}
      />

      {/* Affichage conditionnel : Mobile vs Desktop */}
      {isMobile ? (
        <MobileRoomsList />
      ) : (
        <div
          className="hidden lg:block plan-container"
          style={{ position: "relative", margin: "0 auto" }}
        >
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
                    className="absolute flex justify-center items-center text-black font-semibold text-xs opacity-60 cursor-not-allowed"
                    style={{ top, left, width, height }}
                    onMouseEnter={(e) => handleMouseEnter(salle, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => e.preventDefault()}
                    tabIndex={-1}
                  >
                    {displayText && (
                      <span className="room-label text-center text-[#2a231a] px-2 py-1">
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
                  className="absolute cursor-pointer bg-transparent flex justify-center items-center text-black font-semibold text-xs"
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
                    <span className="room-label text-center text-[#2a231a] px-2 py-1">
                      {displayText}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tooltip Component - Desktop uniquement */}
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
      )}
    </>
  );
}
