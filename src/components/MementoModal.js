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

  // ⚠️ ICI: on ne recadre plus. Version HD, auto format/qualité.
  // (Cloudinary) -> pas de h/c_fill : l’image garde ses proportions.
  const imgSrc = memento?.imageUrl
    ? memento.imageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1600/")
    : "/assets/placeholder.webp";

  // Échap + focus trap + restore focus
  useEffect(() => {
    openerRef.current = document.activeElement;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
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
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
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
          type="button"
          aria-label="Fermer la fenêtre"
        >
          <svg
            className="modal-close-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 6 L18 18 M18 6 L6 18" />
          </svg>
        </button>

        {/* IMAGE ENTIÈRE : wrapper proportionné + contain */}
        <div className="modal-image-wrapper">
          <Image
            src={imgSrc}
            alt={
              memento?.author
                ? `Portrait de ${memento.author}${
                    memento?.role ? `, ${memento.role}` : ""
                  }`
                : "Image du memento"
            }
            fill
            sizes="(max-width: 768px) 95vw, 1200px"
            className="modal-image"
            priority
          />
        </div>

        <div className="modal-text">
          <h2 id="memento-modal-title" className="sr-only">
            {author}
          </h2>
          <blockquote id="memento-modal-desc" className="modal-quote">
            {quote}
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
