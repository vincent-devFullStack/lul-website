"use client";

import Image from "next/image";
import { useEffect } from "react";

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
        </div>
      </div>
    </div>
  );
}
