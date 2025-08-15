"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import MementoModal from "@/components/MementoModal";
import "@/styles/pages/memento.css";

const MAX_LEN = 150;

export default function Memento() {
  const [mementos, setMementos] = useState([]);
  const [selectedMemento, setSelectedMemento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const truncateText = useCallback((text = "", maxLength = MAX_LEN) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "…";
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/memento", {
          signal: controller.signal,
          // côté app router, ça ira dans le cache route si SSR,
          // ici client => on laisse par défaut
        });
        if (!res.ok) throw new Error("Impossible de charger les mementos");
        const data = await res.json();
        setMementos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") setError("Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const openModal = (memento) => {
    setSelectedMemento(memento);
    // lock scroll
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMemento(null);
    // restore scroll
    document.body.style.overflow = "";
  };

  // Nettoyage si on démonte pendant qu’une modale est ouverte
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (loading) {
    return (
      <div className="memento-empty-state" aria-busy="true" aria-live="polite">
        <p>Chargement des mementos…</p>
        <div className="memento-skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="memento-skeleton-card" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="memento-empty-state" role="alert">
        <h2 className="memento-empty-title">Oups</h2>
        <p className="memento-empty-description">{error}</p>
      </div>
    );
  }

  return (
    <>
      {mementos.length === 0 ? (
        <div className="memento-empty-state">
          <h2 className="memento-empty-title">Aucun memento disponible</h2>
          <p className="memento-empty-description">
            Les citations et pensées d'artistes apparaîtront ici prochainement.
          </p>
        </div>
      ) : (
        <main className="memento-grid" aria-label="Liste des mementos">
          {mementos.map((m) => {
            const isLong = (m?.quote?.length || 0) > MAX_LEN;
            const imgAlt = m?.author
              ? `Portrait de ${m.author}${m?.role ? `, ${m.role}` : ""}`
              : "Image liée au memento";

            return (
              <article className="memento-card" key={m?._id || m?.author}>
                <div className="memento-img-wrapper">
                  <Image
                    src={
                      m?.imageUrl
                        ? m.imageUrl.replace(
                            "/upload/",
                            "/upload/w_400,h_349,c_fill/"
                          )
                        : "/assets/placeholder-memento.jpg"
                    }
                    alt={imgAlt}
                    width={400}
                    height={349}
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="memento-img"
                  />
                </div>

                <div className="memento-content">
                  <h2 className="sr-only">
                    {m?.author ? `Citation de ${m.author}` : "Citation"}
                  </h2>

                  <blockquote className="memento-quote">
                    {truncateText(m?.quote)}
                    {isLong && (
                      <div className="expand-button-container">
                        <button
                          type="button"
                          onClick={() => openModal(m)}
                          className="expand-button"
                          aria-label={`Voir la citation complète de ${m?.author || "l'artiste"}`}
                        >
                          Voir plus
                        </button>
                      </div>
                    )}
                  </blockquote>

                  {m?.author && (
                    <div className="memento-author">{m.author}</div>
                  )}
                  {m?.role && <div className="memento-role">{m.role}</div>}

                  {m?.link && (
                    <div className="memento-link">
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="memento-author-link"
                      >
                        🔗 Lien vers le site
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </main>
      )}

      {selectedMemento && (
        <MementoModal
          memento={selectedMemento}
          onClose={closeModal}
          // idéalement, ta modale gère aussi Esc, focus trap et aria-modal
        />
      )}
    </>
  );
}
