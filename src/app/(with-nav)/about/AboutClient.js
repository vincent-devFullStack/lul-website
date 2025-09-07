"use client";

import "../../../styles/pages/about.css";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

export default function AboutClient() {
  const { isAuthenticated } = useAuth();

  // Contenu affiché
  const [title, setTitle] = useState("À propos de moi");
  const [fullText, setFullText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  // État UI
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Champs d’édition
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState(null);

  const titleInputRef = useRef(null);

  // Charger le contenu
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/content/about-page", {
          method: "GET",
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (ac.signal.aborted) return;

        setTitle(data.title || "À propos de moi");
        setFullText(data.content || "Contenu à définir...");
        setImageUrl(data.imageUrl || null);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Erreur chargement about:", err);
        }
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
          setTimeout(() => setIsVisible(true), 100);
        }
      }
    })();

    return () => ac.abort();
  }, []);

  // Édition
  const startEditing = () => {
    setEditTitle(title);
    setEditContent(fullText);
    setEditImageUrl(imageUrl);
    setIsEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setMessage(null);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setMessage({ type: "error", text: "Le titre est requis" });
      return;
    }
    if (!editContent.trim()) {
      setMessage({ type: "error", text: "Le contenu est requis" });
      return;
    }

    setSaving(true);
    setMessage({ type: "info", text: "Sauvegarde en cours..." });

    try {
      const res = await fetch("/api/content/about-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
          imageUrl: editImageUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.error || "Erreur lors de la sauvegarde");

      setTitle(editTitle.trim());
      setFullText(editContent.trim());
      setImageUrl(editImageUrl);

      setMessage({ type: "success", text: "Contenu mis à jour avec succès !" });
      setTimeout(() => {
        setIsEditing(false);
        setMessage(null);
      }, 1200);
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Erreur réseau." });
    } finally {
      setSaving(false);
    }
  };

  const getTextStatus = (text) => {
    const length = text.length;
    if (length === 0) return { type: "empty", message: "Ajoutez du contenu" };
    if (length < 300)
      return {
        type: "short",
        message: `${length} caractères - Peut être plus long`,
      };
    if (length <= 2000)
      return {
        type: "optimal",
        message: `${length} caractères - Longueur idéale`,
      };
    return { type: "info", message: `${length} caractères - Texte long` };
  };

  if (loading) return null;

  return (
    <div className="edit-container">
      {isEditing && (
        <div
          className="edit-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-about-title"
        >
          <div className="edit-modal-content">
            <h2 id="edit-about-title" className="edit-modal-title">
              Modifier le contenu de la page
            </h2>

            {message && (
              <div
                className={`edit-message edit-message-${message.type}`}
                role="status"
                aria-live="polite"
              >
                {message.type === "success" && "✅ "}
                {message.type === "error" && "❌ "}
                {message.type === "info" && "ℹ️ "}
                {message.text}
              </div>
            )}

            <div className="edit-form-group">
              <label className="edit-form-label" htmlFor="about-title-input">
                Titre :
              </label>
              <input
                id="about-title-input"
                ref={titleInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="edit-form-input"
                autoComplete="off"
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Image :</label>
              <ImageUpload
                currentImageUrl={editImageUrl}
                onImageSelected={(url) => setEditImageUrl(url)}
                onImageRemoved={() => setEditImageUrl(null)}
                disabled={saving}
              />
            </div>

            <div className="edit-form-group">
              <label
                className="edit-form-label"
                htmlFor="about-content-textarea"
              >
                Contenu :
              </label>
              <textarea
                id="about-content-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={12}
                className="edit-form-textarea"
                placeholder="Votre contenu ici..."
              />
              <div className="text-analysis">
                <div
                  className={`char-counter char-counter-${getTextStatus(editContent).type}`}
                >
                  {getTextStatus(editContent).message}
                </div>
              </div>
            </div>

            <div className="edit-form-actions">
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="edit-button-cancel"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editTitle.trim() || !editContent.trim()}
                className="edit-button-save"
              >
                {saving ? "⏳ Sauvegarde..." : "💾 Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`about-modern-container ${
          isVisible ? "fade-in-up-active" : "fade-in-up-initial"
        }`}
      >
        <div className="about-hero-section">
          <h1 className="about-title">{title}</h1>
          {isAuthenticated && !isEditing && (
            <div className="edit-button-wrapper">
              <button onClick={startEditing} className="edit-button">
                Editer
              </button>
            </div>
          )}
          <div className="about-image-container">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                width={1000}
                height={1000}
                className="about-image"
                sizes="(max-width: 768px) 90vw, 800px"
                priority
              />
            ) : (
              <div className="about-image-placeholder" aria-hidden="true">
                <svg
                  width="64"
                  height="64"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2a2 2 0 1 1 0-4Zm9 7V7l-6-6H5C3.9 1 3 1.9 3 3v16c0 1.1.9 2 2 2h6v-2H5V3h8v6h8Z" />
                </svg>
                <span>Image à ajouter</span>
              </div>
            )}
          </div>
        </div>

        <div className="about-content-section">
          <div className="about-text">
            {fullText || "Votre présentation apparaîtra ici..."}
          </div>
        </div>
      </div>
    </div>
  );
}
