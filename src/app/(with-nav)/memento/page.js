"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MementoModal from "@/components/MementoModal";
import "@/styles/pages/memento.css";

export default function Memento() {
  const [mementos, setMementos] = useState([]);
  const [selectedMemento, setSelectedMemento] = useState(null);
  const [loading, setLoading] = useState(true);

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  useEffect(() => {
    fetch("/api/memento")
      .then((res) => res.json())
      .then((data) => {
        setMementos(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const openModal = (memento) => {
    setSelectedMemento(memento);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMemento(null);
    document.body.style.overflow = "unset";
  };

  // ✅ Affichage pendant le chargement
  if (loading) {
    return (
      <div className="memento-empty-state">
        <p>Chargement des mementos...</p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Message si aucun memento */}
      {mementos.length === 0 ? (
        <div className="memento-empty-state">
          <h2 className="memento-empty-title">Aucun memento disponible</h2>
          <p className="memento-empty-description">
            Les citations et pensées d'artistes apparaîtront ici prochainement.
          </p>
        </div>
      ) : (
        <div className="memento-grid">
          {mementos.map((m) => (
            <div className="memento-card" key={m._id}>
              <div className="memento-img-wrapper">
                <Image
                  src={m.imageUrl}
                  alt={m.author}
                  width={300}
                  height={180}
                  className="memento-img"
                />
              </div>
              <div className="memento-content">
                <blockquote className="memento-quote">
                  {truncateText(m.quote)}
                  {m.quote.length > 150 && (
                    <div className="expand-button-container">
                      <button
                        onClick={() => openModal(m)}
                        className="expand-button"
                      >
                        Voir plus
                      </button>
                    </div>
                  )}
                </blockquote>

                <div className="memento-author">{m.author}</div>
                <div className="memento-role">{m.role}</div>

                {m.link && (
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
            </div>
          ))}
        </div>
      )}

      {selectedMemento && (
        <MementoModal memento={selectedMemento} onClose={closeModal} />
      )}
    </>
  );
}
