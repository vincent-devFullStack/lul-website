import React, { memo, useMemo } from "react";

/**
 * @typedef {Object} Salle
 * @property {string=} _id
 * @property {string=} slug
 * @property {string=} name
 * @property {string=} description
 * @property {"open"|"maintenance"= } status
 * @property {number=} displayOrder
 * @property {Array<any>=} artworks
 */

/**
 * @param {{ salles?: Salle[], handleRoomClick: (e: React.MouseEvent, slug: string) => void }} props
 */
function MobileRoomsListBase({ salles = [], handleRoomClick }) {
  const { activeRooms, maintenanceRooms } = useMemo(() => {
    const list = Array.isArray(salles) ? [...salles] : [];
    // tri stable par displayOrder si présent
    list.sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0));
    return {
      activeRooms: list.filter((s) => s?.status !== "maintenance"),
      maintenanceRooms: list.filter((s) => s?.status === "maintenance"),
    };
  }, [salles]);

  return (
    <div className="lg:hidden min-h-screen border rounded-lg bg-gradient-to-b from-[var(--header-background)] to-[var(--login-background)] w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-4 px-2">
            Explorez les Salles du Musée
          </h1>
          <p className="text-[var(--foreground)] opacity-80 px-2">
            Découvrez nos collections en visitant chaque salle
          </p>
        </div>

        {/* Salles ouvertes */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {activeRooms.length === 0 ? (
            <div className="col-span-full text-center text-sm text-[var(--foreground)]/70">
              Aucune salle disponible pour le moment.
            </div>
          ) : (
            activeRooms.map((salle) => (
              <button
                key={salle.slug || salle._id}
                onClick={(e) => salle.slug && handleRoomClick(e, salle.slug)}
                className="text-left bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 cursor-pointer border border-[rgba(191,167,106,0.2)] hover:border-[var(--brown)] transform hover:scale-[1.02] w-full"
                aria-label={`Visiter la salle ${salle?.name ?? ""}`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-2 break-words">
                      {salle?.name}
                    </h3>
                    {salle?.description && (
                      <p className="text-sm text-[var(--foreground)] opacity-70 mb-3 break-words">
                        {salle.description}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-[var(--brown)] font-medium">
                      <span>Visiter la salle</span>
                      <svg
                        className="w-4 h-4 ml-2 transition-transform duration-200 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  {!!salle?.artworks?.length && (
                    <div className="mt-4 pt-4 border-t border-[rgba(191,167,106,0.2)]">
                      <div className="flex items-center text-xs text-[var(--brown)]">
                        <div className="w-2 h-2 bg-[var(--brown)] rounded-full mr-2 flex-shrink-0" />
                        <span className="break-words">
                          {salle.artworks.length} œuvre
                          {salle.artworks.length > 1 ? "s" : ""} à découvrir
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Salles en maintenance */}
        {maintenanceRooms.length > 0 && (
          <div className="mt-8 w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-4 px-2">
              Salles temporairement fermées
            </h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {maintenanceRooms.map((salle) => (
                <div
                  key={salle.slug || salle._id}
                  className="bg-gray-100 rounded-lg p-4 opacity-60 w-full"
                  aria-label={`${salle?.name ?? "Salle"} en maintenance`}
                >
                  <h3 className="text-base font-medium text-gray-600 mb-1 break-words">
                    {salle?.name}
                  </h3>
                  {salle?.description && (
                    <p className="text-sm text-gray-500 mb-2 break-words">
                      {salle.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-orange-600">
                    🛠️ Salle en maintenance
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mémo avec comparaison légère (longueur + ids/slugs + statuts)
const areEqual = (prev, next) => {
  const a = prev.salles || [];
  const b = next.salles || [];
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ak = a[i]?.slug || a[i]?._id || "";
    const bk = b[i]?.slug || b[i]?._id || "";
    if (ak !== bk || a[i]?.status !== b[i]?.status) return false;
  }
  // on assume handleRoomClick stable (useCallback côté parent)
  return prev.handleRoomClick === next.handleRoomClick;
};

const MobileRoomsList = memo(MobileRoomsListBase, areEqual);
MobileRoomsList.displayName = "MobileRoomsList";

export default MobileRoomsList;
