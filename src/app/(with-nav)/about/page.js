"use client";

import "../../../styles/pages/about.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

export default function About() {
  const { isAuthenticated } = useAuth();
  const [fullText, setFullText] = useState("");
  const [title, setTitle] = useState("À propos de moi");
  const [imageUrl, setImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [textAnalysis, setTextAnalysis] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Charger le contenu depuis l'API
  useEffect(() => {
    const fetchContent = async () => {
      if (initialized) return;

      try {
        setLoading(true);
        const response = await fetch("/api/content/about-page", {
          cache: "force-cache",
        });

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title || "À propos de moi");
          setFullText(data.content || "Contenu à définir...");
          setImageUrl(data.imageUrl || null);
          setInitialized(true);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [initialized]);

  // Fonction pour sauvegarder les modifications
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
      const response = await fetch("/api/content/about-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
          imageUrl: editImageUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTitle(editTitle.trim());
        setFullText(editContent.trim());
        setImageUrl(editImageUrl);
        setMessage({
          type: "success",
          text: "Contenu mis à jour avec succès !",
        });

        setTimeout(() => {
          setIsEditing(false);
          setMessage(null);
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: `Erreur lors de la sauvegarde : ${errorData.error}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setMessage({
        type: "error",
        text: "Erreur de connexion. Vérifiez votre réseau.",
      });
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    setEditTitle(title);
    setEditContent(fullText);
    setEditImageUrl(imageUrl);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setEditImageUrl(null);
    setMessage(null);
  };

  useEffect(() => {
    if (!fullText) return;

    const totalChars = fullText.length;
    setTextAnalysis({
      totalChars,
      fitsInLayout: true,
      isAdaptive: true,
      layoutType: "css-columns",
    });
  }, [fullText]);

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

  // ✅ Effect pour déclencher l'animation fade in up
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // ✅ Pas d'affichage de chargement, retourne null pendant le loading
  if (loading) {
    return null;
  }

  return (
    <div className="edit-container">
      {isAuthenticated && !isEditing && (
        <div className="edit-button-wrapper">
          <button onClick={startEditing} className="edit-button">
            ✏️ Modifier le contenu de la page
          </button>
        </div>
      )}

      <div className="about-container">
        {isEditing && (
          <div className="edit-modal-overlay">
            <div className="edit-modal-content">
              <h2 className="edit-modal-title">
                Modifier le contenu de la page
              </h2>

              {message && (
                <div className={`edit-message edit-message-${message.type}`}>
                  {message.type === "success" && "✅"}
                  {message.type === "error" && "❌"}
                  {message.type === "info" && "ℹ️"}
                  {message.text}
                </div>
              )}

              <div className="edit-form-group">
                <label className="edit-form-label">Titre :</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="edit-form-input"
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Image :</label>
                <ImageUpload
                  currentImageUrl={editImageUrl}
                  onImageSelected={(imageUrl) => setEditImageUrl(imageUrl)}
                  onImageRemoved={() => setEditImageUrl(null)}
                  disabled={saving}
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Contenu :</label>
                <textarea
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

                  {textAnalysis && fullText && (
                    <div className="text-distribution">
                      <small>
                        📖 {textAnalysis.totalChars} caractères • Layout CSS
                        automatique
                      </small>
                    </div>
                  )}
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
                  {saving ? <>⏳ Sauvegarde...</> : <>💾 Sauvegarder</>}
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

            <div className="about-image-container">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  width={500}
                  height={300}
                  className="about-image"
                />
              ) : (
                <div className="about-image-placeholder">
                  <svg
                    width="64"
                    height="64"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21Z" />
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
    </div>
  );
}
