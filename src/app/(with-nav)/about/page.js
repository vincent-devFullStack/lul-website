"use client";

import "../../../styles/pages/about.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export default function About() {
  const { isAuthenticated } = useAuth();
  const leftPageRef = useRef(null);
  const [leftContent, setLeftContent] = useState("");
  const [rightContent, setRightContent] = useState("");
  const [fullText, setFullText] = useState("");
  const [title, setTitle] = useState("À propos de moi");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger le contenu depuis l'API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/content/about-page");
        
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title || "À propos de moi");
          setFullText(data.content || "Contenu à définir...");
        } else {
          // Contenu par défaut si l'API ne répond pas
          setTitle("À propos de moi");
          setFullText("Contenu à définir...");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du contenu:", error);
        setTitle("À propos de moi");
        setFullText("Contenu à définir...");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/content/about-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTitle(editTitle.trim());
        setFullText(editContent.trim());
        setIsEditing(false);
        alert("Contenu mis à jour avec succès !");
      } else {
        const errorData = await response.json();
        alert("Erreur lors de la sauvegarde : " + errorData.error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour démarrer l'édition
  const startEditing = () => {
    setEditTitle(title);
    setEditContent(fullText);
    setIsEditing(true);
  };

  // Fonction pour annuler l'édition
  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  const splitTextContent = useCallback(() => {
    if (!leftPageRef.current || !fullText) return;

    const leftPage = leftPageRef.current;

    const testElement = document.createElement("div");
    testElement.style.cssText = `
      position: absolute;
      visibility: hidden;
      width: ${leftPage.offsetWidth - 60}px;
      font-size: 1.125rem;
      line-height: 1.57;
      color: var(--foreground);
      padding: 0;
      margin: 0;
      margin-bottom: 1rem;
      white-space: pre-line;
      text-align: justify;
    `;
    document.body.appendChild(testElement);

    const availableHeight = leftPage.offsetHeight - 280;

    // Diviser le texte par paragraphes pour préserver les retours à la ligne
    const paragraphs = fullText.split('\n');
    let leftText = "";
    let currentParagraphIndex = 0;
    let wordsInCurrentParagraph = 0;

    while (currentParagraphIndex < paragraphs.length) {
      const currentParagraph = paragraphs[currentParagraphIndex];
      const words = currentParagraph.split(' ');
      
      // Essayer d'ajouter le paragraphe entier d'abord
      const potentialLeftText = leftText + 
        (leftText ? '\n' : '') + 
        currentParagraph;
      
      testElement.textContent = potentialLeftText;

      if (testElement.offsetHeight > availableHeight) {
        // Si le paragraphe entier ne rentre pas, essayer mot par mot
        if (wordsInCurrentParagraph === 0) {
          // Premier mot du paragraphe, essayer de le diviser
          for (let i = 0; i < words.length; i++) {
            const testText = leftText + 
              (leftText ? '\n' : '') + 
              words.slice(0, i + 1).join(' ');
            
            testElement.textContent = testText;
            
            if (testElement.offsetHeight > availableHeight) {
              if (i === 0 && leftText === "") {
                // Même le premier mot ne rentre pas, le prendre quand même
                leftText = words[0];
                wordsInCurrentParagraph = 1;
              }
              break;
            }
            
            leftText = testText;
            wordsInCurrentParagraph = i + 1;
          }
        }
        break;
      }

      leftText = potentialLeftText;
      currentParagraphIndex++;
      wordsInCurrentParagraph = 0;
    }

    // Construire le texte de droite avec le reste
    let rightText = "";
    
    if (currentParagraphIndex < paragraphs.length) {
      const remainingWords = paragraphs[currentParagraphIndex]
        .split(' ')
        .slice(wordsInCurrentParagraph);
      
      if (remainingWords.length > 0 && remainingWords[0] !== '') {
        rightText = remainingWords.join(' ');
      }
      
      // Ajouter les paragraphes suivants
      const remainingParagraphs = paragraphs.slice(currentParagraphIndex + 1);
      if (remainingParagraphs.length > 0) {
        rightText += (rightText ? '\n' : '') + remainingParagraphs.join('\n');
      }
    }

    document.body.removeChild(testElement);

    setLeftContent(leftText);
    setRightContent(rightText);
  }, [fullText]);

  useEffect(() => {
    const timer = setTimeout(splitTextContent, 200);
    window.addEventListener("resize", splitTextContent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", splitTextContent);
    };
  }, [splitTextContent]);

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
          <button
            onClick={startEditing}
            className="edit-button"
          >
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
            
            <div className="edit-form-group">
              <label className="edit-form-label">
                Titre :
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="edit-form-input"
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">
                Contenu :
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={15}
                className="edit-form-textarea"
                placeholder="Votre contenu ici..."
              />
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
                disabled={saving}
                className="edit-button-save"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu du livre */}
      <div className="about-content about-left" ref={leftPageRef}>
        <div className="page-content">
          <h1 className="book-title" id="about-title">
            {title}
          </h1>

          <div className="image-placeholder">
            <div className="placeholder-content">[Image à venir]</div>
          </div>

          <p className="book-text">{leftContent}</p>
        </div>
      </div>

      <div className="about-content about-right">
        <div className="page-content">
          <p className="book-text">{rightContent}</p>
        </div>
      </div>
    </div>
    </div>
  );
}
