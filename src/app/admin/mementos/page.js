"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/pages/memento.css";

export default function Memento() {
  const [mementos, setMementos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    quote: "",
    author: "",
    role: "",
    link: "", // Nouveau champ
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const openModal = (mode, memento = null) => {
    setModalMode(mode);
    setModalOpen(true);
    if (mode === "edit" && memento) {
      setFormData({
        _id: memento._id,
        quote: memento.quote,
        author: memento.author,
        role: memento.role,
        link: memento.link || "", // ✅ Fallback si pas de link
        imageUrl: memento.imageUrl,
      });
    } else {
      setFormData({ quote: "", author: "", role: "", link: "", imageUrl: "" });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ quote: "", author: "", role: "", link: "", imageUrl: "" });
    setMessage(null);
  };

  useEffect(() => {
    fetch("/api/memento") // Changé de "/api/mementos" à "/api/memento"
      .then((res) => res.json())
      .then(setMementos);
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("image", file);
    form.append("folder", "mementos");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur upload image",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'upload" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const dataToSend = {
      ...(modalMode === "edit" && { id: formData._id }),
      quote: formData.quote,
      author: formData.author,
      role: formData.role,
      link: formData.link,
      imageUrl: formData.imageUrl,
    };

    try {
      const res = await fetch("/api/memento", {
        method: modalMode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        closeModal();
        // Rafraîchir la liste
        const updatedMementos = await fetch("/api/memento").then((r) =>
          r.json()
        );
        setMementos(updatedMementos);
        setMessage({ type: "success", text: "Memento enregistré !" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Erreur" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement" });
    } finally {
      setUploading(false);
    }
  };

  // ✅ AJOUTER CETTE FONCTION MANQUANTE
  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce memento ?")) {
      return;
    }

    try {
      const res = await fetch("/api/memento", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Rafraîchir la liste
        const updatedMementos = await fetch("/api/memento").then((r) =>
          r.json()
        );
        setMementos(updatedMementos);
        setMessage({ type: "success", text: "Memento supprimé avec succès !" });
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.error || "Erreur lors de la suppression",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la suppression" });
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des mementos</h1>
        <p className="admin-page-subtitle">
          Ajoutez, modifiez ou supprimez vos citations et auteurs
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <button className="admin-btn" onClick={() => openModal("add")}>
          + Ajouter un memento
        </button>
      </div>

      {mementos.length === 0 ? (
        <div className="admin-card">
          <p>Aucun memento pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mementos.map((m) => (
            <div key={m._id} className="admin-memento-card">
              <div className="memento-image">
                <Image
                  src={m.imageUrl}
                  alt={m.author}
                  width={120}
                  height={80}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    objectPosition: "center",
                  }}
                />
              </div>
              <div className="memento-content">
                <blockquote className="memento-quote">"{m.quote}"</blockquote>
                <div className="memento-author">{m.author}</div>
                <div className="memento-role">{m.role}</div>
                {m.link && (
                  <div className="memento-link">
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="memento-author-link"
                    >
                      🔗 Lien vers le site
                    </a>
                  </div>
                )}
              </div>
              <div className="memento-actions">
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => openModal("edit", m)}
                >
                  Modifier
                </button>
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(m._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === "add"
                  ? "Ajouter un memento"
                  : "Modifier le memento"}
              </h2>
              <button onClick={closeModal} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label">Citation</label>
                <textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  required
                  className="admin-form-textarea"
                  placeholder="Ex : L’art lave notre âme de la poussière du quotidien."
                  rows={3}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Auteur</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="admin-form-input"
                  placeholder="Ex : Pablo Picasso"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Rôle</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="admin-form-input"
                  placeholder="Ex : Peintre, Espagne"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Lien (optionnel)</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  placeholder="Ex : https://fr.wikipedia.org/wiki/Pablo_Picasso"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Image</label>

                <div className="admin-form-file-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="admin-form-file" // Changé de admin-form-input à admin-form-file
                    id="file-upload-button"
                  />
                  <label
                    htmlFor="file-upload-button"
                    className="admin-form-file-label"
                  >
                    <div className="admin-form-file-text">
                      Cliquez pour choisir une image
                    </div>
                  </label>
                </div>
                {formData.imageUrl && (
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={formData.imageUrl}
                      alt="Aperçu"
                      width={200}
                      height={120}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="admin-btn admin-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="admin-btn"
                  disabled={uploading || !formData.imageUrl}
                >
                  {uploading ? "Enregistrement..." : "Ajouter"}
                </button>
              </div>
              {message && (
                <div className={`message message-${message.type}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
