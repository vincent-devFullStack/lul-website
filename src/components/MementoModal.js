"use client";

import Image from "next/image";
import { useEffect } from "react";
import "@/styles/components/MementoModal.css"; // ✅ Importez le CSS

export default function MementoModal({ memento, onClose }) {
  // Fermeture avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-image-wrapper">
          <Image
            src={memento.imageUrl}
            alt={memento.author}
            width={600}
            height={400}
            className="modal-image"
          />
        </div>
        <div className="modal-text">
          <blockquote className="modal-quote">"{memento.quote}"</blockquote>
          <div className="modal-author">{memento.author}</div>
          <div className="modal-role">{memento.role}</div>

          {/* ✅ AJOUT : Lien vers le site */}
          {memento.link && (
            <div className="modal-link">
              <a
                href={memento.link}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-link-button"
              >
                🔗 Lien vers le site
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
