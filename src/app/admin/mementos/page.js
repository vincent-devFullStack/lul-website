"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import "@/styles/pages/memento.css";

export default function AdminMementos() {
  const [mementos, setMementos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [formData, setFormData] = useState({
    quote: "",
    author: "",
    role: "",
    link: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const resetForm = () =>
    setFormData({ quote: "", author: "", role: "", link: "", imageUrl: "" });

  const loadMementos = useCallback(async () => {
    try {
      const res = await fetch("/api/memento", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMementos(Array.isArray(data) ? data : []);
    } catch {
      setMessage({
        type: "error",
        text: "❌ Erreur lors du chargement des mementos",
      });
    }
  }, []);

  useEffect(() => {
    loadMementos();
  }, [loadMementos]);

  const openModal = (mode, memento = null) => {
    setModalMode(mode);
    setModalOpen(true);
    document.body.style.overflow = "hidden"; // bloque le scroll fond

    if (mode === "edit" && memento) {
      setFormData({
        _id: memento._id,
        quote: memento.quote ?? "",
        author: memento.author ?? "",
        role: memento.role ?? "",
        link: memento.link ?? "",
        imageUrl: memento.imageUrl ?? "",
      });
    } else {
      resetForm();
    }
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.style.overflow = "";
    resetForm();
    // on garde le message visible comme sur la page salles
  }, []);

  // ESC pour fermer la modale
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("folder", "mementos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || "Upload échoué");
      }
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch {
      setMessage({
        type: "error",
        text: "❌ Erreur lors de l'upload de l'image",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      ...(modalMode === "edit" && { id: formData._id }),
      quote: formData.quote.trim(),
      author: formData.author.trim(),
      role: formData.role.trim(),
      link: formData.link.trim(),
      imageUrl: formData.imageUrl,
    };

    try {
      const res = await fetch("/api/memento", {
        method: modalMode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const ok = res.ok;
      const data = await res.json().catch(() => ({}));
      if (!ok) throw new Error(data.error || "Erreur serveur");

      closeModal();
      await loadMementos();
      setMessage({
        type: "success",
        text:
          modalMode === "edit"
            ? "✅ Memento modifié avec succès"
            : "✅ Memento ajouté avec succès",
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text: `❌ ${err.message || "Erreur lors de l'enregistrement"}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce memento ?")) return;

    try {
      const res = await fetch("/api/memento", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        cache: "no-store",
      });

      const ok = res.ok;
      const data = await res.json().catch(() => ({}));
      if (!ok) throw new Error(data.error || "Erreur serveur");

      await loadMementos();
      setMessage({ type: "success", text: "✅ Memento supprimé avec succès" });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text: `❌ ${err.message || "Erreur lors de la suppression"}`,
      });
    }
  };

  const messageClass = !message
    ? ""
    : message.type === "success"
      ? "mt-4 p-3 rounded-lg border bg-green-100 border-green-300 text-green-800 text-sm font-medium text-center"
      : message.type === "error"
        ? "mt-4 p-3 rounded-lg border bg-red-100 border-red-300 text-red-800 text-sm font-medium text-center"
        : "mt-4 p-3 rounded-lg border bg-gray-100 border-gray-300 text-gray-800 text-sm font-medium text-center";

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des mementos</h1>
        <p className="admin-page-subtitle">
          Ajoutez, modifiez ou supprimez vos citations et auteurs
        </p>
      </div>

      {message && <div className={messageClass}>{message.text}</div>}

      <div className="mb-6">
        <button className="admin-btn" onClick={() => openModal("add")}>
          + Ajouter un memento
        </button>
      </div>

      {mementos.length === 0 ? (
        <div className="admin-card">
          <p>Aucun memento pour le moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
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
                <blockquote className="memento-quote">“{m.quote}”</blockquote>
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
        <div
          className="modal-overlay"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="memento-modal-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="memento-modal-title" className="modal-title">
                {modalMode === "add"
                  ? "Ajouter un memento"
                  : "Modifier le memento"}
              </h2>
              <button
                onClick={closeModal}
                className="modal-close"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="quote">
                  Citation
                </label>
                <textarea
                  id="quote"
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
                <label className="admin-form-label" htmlFor="author">
                  Auteur
                </label>
                <input
                  id="author"
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
                <label className="admin-form-label" htmlFor="role">
                  Rôle
                </label>
                <input
                  id="role"
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
                <label className="admin-form-label" htmlFor="link">
                  Lien (optionnel)
                </label>
                <input
                  id="link"
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  placeholder="Ex : https://fr.wikipedia.org/wiki/Pablo_Picasso"
                />
              </div>

              <div className="admin-form-group">
                <label
                  className="admin-form-label"
                  htmlFor="file-upload-button"
                >
                  Image
                </label>

                <div className="admin-form-file-wrapper">
                  <input
                    id="file-upload-button"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="admin-form-file"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload-button"
                    className="admin-form-file-label"
                  >
                    <div className="admin-form-file-text">
                      {uploading
                        ? "Téléversement en cours…"
                        : "Cliquez pour choisir une image"}
                    </div>
                  </label>
                </div>

                {formData.imageUrl && (
                  <div className="mt-3 flex justify-center">
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
                  disabled={saving || !formData.imageUrl}
                >
                  {saving
                    ? modalMode === "edit"
                      ? "Modification..."
                      : "Enregistrement..."
                    : modalMode === "edit"
                      ? "Modifier"
                      : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
