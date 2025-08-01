"use client";

import "../../../styles/pages/about.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ImageUpload"; // ✅ IMPORT DU COMPOSANT
import Image from "next/image";

export default function About() {
  const { isAuthenticated } = useAuth();
  // ✅ PLUS BESOIN DE SÉPARER - CSS GÈRE TOUT
  const [fullText, setFullText] = useState("");
  const [title, setTitle] = useState("À propos de moi");
  const [imageUrl, setImageUrl] = useState(null); // ✅ STATE POUR L'IMAGE
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState(null); // ✅ STATE POUR L'IMAGE EN ÉDITION
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // ✅ MESSAGES D'ÉTAT PROFESSIONNELS
  const [textAnalysis, setTextAnalysis] = useState(null); // ✅ ANALYSE DU TEXTE
  // Ajoutez un état pour éviter les re-rendus inutiles
  const [initialized, setInitialized] = useState(false);

  // Charger le contenu depuis l'API
  useEffect(() => {
    const fetchContent = async () => {
      if (initialized) return; // Évite les doubles chargements

      try {
        setLoading(true);
        const response = await fetch("/api/content/about-page", {
          cache: "force-cache", // Met en cache la réponse
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
    // Validation côté client
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
          imageUrl: editImageUrl, // ✅ INCLURE L'IMAGE DANS LA SAUVEGARDE
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

        // Fermer le modal après un délai
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

  // Fonction pour démarrer l'édition
  const startEditing = () => {
    setEditTitle(title);
    setEditContent(fullText);
    setEditImageUrl(imageUrl); // ✅ CHARGER L'IMAGE ACTUELLE DANS L'ÉDITION
    setIsEditing(true);
  };

  // Fonction pour annuler l'édition
  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setEditImageUrl(null);
    setMessage(null); // ✅ CLEAR MESSAGES
  };

  // ✅ ANALYSE SIMPLE DU TEXTE (CSS GÈRE LA RÉPARTITION)
  useEffect(() => {
    if (!fullText) return;

    const totalChars = fullText.length;
    setTextAnalysis({
      totalChars,
      fitsInLayout: true, // CSS gère tout
      isAdaptive: true,
      layoutType: "css-columns",
    });
  }, [fullText]);

  // ✅ CALCULER L'ÉTAT DU TEXTE SIMPLIFIÉ
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

  if (loading) {
    return (
      <div className="about-container">
        <div className="about-content about-left">
          <div className="page-content">
            <p className="book-text">Chargement...</p>
          </div>
        </div>
        <div className="about-content about-right">
          <div className="page-content">
            <p className="book-text"></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Boutons d'édition - visibles seulement si connecté */}
      {isAuthenticated && !isEditing && (
        <div className="edit-button-wrapper">
          <button onClick={startEditing} className="edit-button">
            ✏️ Modifier le contenu de la page
          </button>
        </div>
      )}

      <div className="about-container">
        {/* Interface d'édition */}
        {isEditing && (
          <div className="edit-modal-overlay">
            <div className="edit-modal-content">
              <h2 className="edit-modal-title">
                Modifier le contenu de la page
              </h2>

              {/* Messages d'état */}
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

                {/* ✅ COMPTEUR INTELLIGENT */}
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

        {/* Design moderne et élégant */}
        <div className="about-modern-container">
          <div className="about-hero-section">
            <h1 className="about-title">{title}</h1>

            <div className="about-image-container">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  width={500} // spécifiez une largeur
                  height={300} // spécifiez une hauteur
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
