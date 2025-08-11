"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * @param {Object} props
 * @param {string|null} [props.currentImageUrl]
 * @param {(imageUrl: string, raw?: any) => void} [props.onImageSelected]
 * @param {() => void} [props.onImageRemoved]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {"artworks"|"mementos"} [props.folder="artworks"] - Dossier Cloudinary autorisé par l'API
 */
export default function ImageUpload({
  currentImageUrl = null,
  onImageSelected,
  onImageRemoved,
  disabled = false,
  className = "",
  folder = "artworks",
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const abortRef = useRef(null);
  const tempObjectURLRef = useRef(null);

  // Suivre un changement externe de currentImageUrl (édition)
  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  // Nettoyage objectURL & upload en cours
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (tempObjectURLRef.current) {
        URL.revokeObjectURL(tempObjectURLRef.current);
        tempObjectURLRef.current = null;
      }
    };
  }, []);

  const resetStates = () => {
    setError(null);
    setDragActive(false);
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Format non supporté. Utilisez JPG, PNG ou WebP.");
    }
    if (file.size > maxSize) {
      throw new Error("Fichier trop volumineux. Maximum 5MB.");
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder); // ← passe le dossier à l'API

    // Annule l’upload précédent si on en démarre un nouveau
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      let errMsg = "Erreur lors de l'upload";
      try {
        const data = await response.json();
        errMsg = data?.error || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    return response.json();
  };

  const handleFileSelect = async (file) => {
    resetStates();

    try {
      validateFile(file);
      setUploading(true);

      // Aperçu local immédiat
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      tempObjectURLRef.current = previewUrl;

      const uploadResult = await uploadFile(file);

      // Remplace l’aperçu par l’URL Cloudinary + nettoie l’objectURL
      if (tempObjectURLRef.current) {
        URL.revokeObjectURL(tempObjectURLRef.current);
        tempObjectURLRef.current = null;
      }
      setPreview(uploadResult.imageUrl);

      onImageSelected?.(uploadResult.imageUrl, uploadResult);
    } catch (err) {
      console.error("Erreur upload:", err);
      setError(err?.message || "Erreur lors de l'upload");
      // Revenir à l’image courante si dispo
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    resetStates();

    // Nettoyage éventuel de l’aperçu temp
    if (tempObjectURLRef.current) {
      URL.revokeObjectURL(tempObjectURLRef.current);
      tempObjectURLRef.current = null;
    }

    setPreview(null);
    onImageRemoved?.();
  };

  // Drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || uploading) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      // Donne un hint visuel côté OS
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || uploading) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const openFileDialog = () => {
    if (!disabled && !uploading) fileInputRef.current?.click();
  };

  const handleKeyOpen = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFileDialog();
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
        <div className="image-upload-preview" aria-busy={uploading}>
          <Image
            src={preview}
            alt="Aperçu de l'image sélectionnée"
            className="image-upload-image"
            width={500}
            height={300}
            priority={false}
          />
          <div className="image-upload-overlay">
            <button
              type="button"
              onClick={openFileDialog}
              disabled={disabled || uploading}
              className="image-upload-btn image-upload-btn-change"
            >
              {uploading ? "⏳ Upload..." : "📷 Changer"}
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
        <div
          className={`image-upload-dropzone ${dragActive ? "active" : ""} ${disabled ? "disabled" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          onKeyDown={handleKeyOpen}
          role="button"
          tabIndex={0}
          aria-disabled={disabled || uploading}
          aria-busy={uploading}
          aria-label="Choisir une image à téléverser"
        >
          <div className="image-upload-content" aria-live="polite">
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

      {error && (
        <div className="image-upload-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      <style jsx>{`
        .image-upload-container {
          width: 100%;
          max-width: 420px;
        }
        .image-upload-dropzone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
          outline: none;
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
          inset: 0;
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
