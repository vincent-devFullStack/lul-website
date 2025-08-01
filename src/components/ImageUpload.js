"use client";

import { useState, useRef } from "react";
import Image from "next/image";

/**
 * Composant d'upload d'image professionnel et réutilisable
 *
 * @param {Object} props
 * @param {string} props.currentImageUrl - URL de l'image actuelle (optionnel)
 * @param {Function} props.onImageSelected - Callback appelé quand une image est sélectionnée
 * @param {Function} props.onImageRemoved - Callback appelé quand l'image est supprimée
 * @param {boolean} props.disabled - Désactiver le composant
 * @param {string} props.className - Classes CSS additionnelles
 */
export default function ImageUpload({
  currentImageUrl = null,
  onImageSelected,
  onImageRemoved,
  disabled = false,
  className = "",
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const resetStates = () => {
    setError(null);
    setDragActive(false);
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Format non supporté. Utilisez JPG, PNG ou WebP.");
    }

    if (file.size > maxSize) {
      throw new Error("Fichier trop volumineux. Maximum 5MB.");
    }

    return true;
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de l'upload");
    }

    return response.json();
  };

  const handleFileSelect = async (file) => {
    resetStates();

    try {
      validateFile(file);
      setUploading(true);

      // Preview immédiat
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload vers le serveur
      const uploadResult = await uploadFile(file);

      // Nettoyer l'URL temporaire et utiliser l'URL serveur
      URL.revokeObjectURL(previewUrl);
      setPreview(uploadResult.imageUrl);

      // Notifier le parent
      if (onImageSelected) {
        onImageSelected(uploadResult.imageUrl, uploadResult);
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      setError(err.message);
      setPreview(currentImageUrl); // Revenir à l'image précédente
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    resetStates();
    setPreview(null);

    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        disabled={disabled || uploading}
      />

      {preview ? (
        // Zone avec image
        <div className="image-upload-preview">
          <Image
            src={preview}
            alt="Aperçu"
            className="image-upload-image"
            width={500} // spécifiez une largeur
            height={300} // spécifiez une hauteur
          />
          <div className="image-upload-overlay">
            <button
              type="button"
              onClick={openFileDialog}
              disabled={disabled || uploading}
              className="image-upload-btn image-upload-btn-change"
            >
              {uploading ? "⏳" : "📷"} {uploading ? "Upload..." : "Changer"}
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled || uploading}
              className="image-upload-btn image-upload-btn-remove"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      ) : (
        // Zone de drop/upload
        <div
          className={`image-upload-dropzone ${dragActive ? "active" : ""} ${disabled ? "disabled" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="image-upload-content">
            {uploading ? (
              <>
                <div className="image-upload-spinner">⏳</div>
                <p>Upload en cours...</p>
              </>
            ) : (
              <>
                <div className="image-upload-icon">📷</div>
                <p>Cliquez ou glissez une image ici</p>
                <small>JPG, PNG, WebP • Max 5MB</small>
              </>
            )}
          </div>
        </div>
      )}

      {error && <div className="image-upload-error">⚠️ {error}</div>}

      <style jsx>{`
        .image-upload-container {
          width: 100%;
          max-width: 400px;
        }

        .image-upload-dropzone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .image-upload-dropzone:hover:not(.disabled) {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .image-upload-dropzone.active {
          border-color: #007bff;
          background: #e6f3ff;
          transform: scale(1.02);
        }

        .image-upload-dropzone.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .image-upload-content {
          pointer-events: none;
        }

        .image-upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .image-upload-spinner {
          font-size: 2rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .image-upload-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #f0f0f0;
        }

        .image-upload-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .image-upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-upload-preview:hover .image-upload-overlay {
          opacity: 1;
        }

        .image-upload-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .image-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .image-upload-btn-change {
          background: #007bff;
          color: white;
        }

        .image-upload-btn-change:hover:not(:disabled) {
          background: #0056b3;
        }

        .image-upload-btn-remove {
          background: #dc3545;
          color: white;
        }

        .image-upload-btn-remove:hover:not(:disabled) {
          background: #c82333;
        }

        .image-upload-error {
          color: #dc3545;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
