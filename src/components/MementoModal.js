"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import "@/styles/components/MementoModal.css";

export default function MementoModal({ memento, onClose }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const openerRef = useRef(null);

  const author = memento?.author || "Auteur inconnu";
  const role = memento?.role || "";
  const quote = memento?.quote || "";
  const imgSrc = memento?.imageUrl
    ? memento.imageUrl.replace("/upload/", "/upload/w_600,h_400,c_fill/")
    : "/assets/placeholder.webp";

  // Échap + mémorise/restaure le focus
  useEffect(() => {
    openerRef.current = document.activeElement;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
        // Focus trap
        const focusables = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    // Focus initial sur le bouton Fermer
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      // Retour focus à l'opener
      if (openerRef.current && typeof openerRef.current.focus === "function") {
        openerRef.current.focus();
      }
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="memento-modal-title"
      aria-describedby="memento-modal-desc"
    >
      <div
        ref={dialogRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer"
          type="button"
        >
          ×
        </button>

        <div className="modal-image-wrapper">
          <Image
            src={imgSrc}
            alt={author}
            width={600}
            height={400}
            className="modal-image"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
        </div>

        <div className="modal-text">
          <h2 id="memento-modal-title" className="sr-only">
            {author}
          </h2>
          <blockquote id="memento-modal-desc" className="modal-quote">
            “{quote}”
          </blockquote>
          <div className="modal-author">{author}</div>
          {role && <div className="modal-role">{role}</div>}

          {memento?.link && (
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
