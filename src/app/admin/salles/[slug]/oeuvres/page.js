"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Trash2, Plus, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminOeuvresPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [room, setRoom] = useState(null);
  const [artworks, setArtworks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // {type:"success"|"error", text:string}

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [editingArtwork, setEditingArtwork] = useState(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);

  const [roomFormData, setRoomFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "", // si on garde l’URL existante en édition
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const messageClass = !message
    ? ""
    : message.type === "success"
      ? "mt-4 p-3 rounded-lg border bg-green-100 border-green-300 text-green-800 text-sm font-medium text-center"
      : "mt-4 p-3 rounded-lg border bg-red-100 border-red-300 text-red-800 text-sm font-medium text-center";

  const fetchArtworks = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/salles/${slug}/oeuvres`, {
        cache: "no-store",
      });
      if (!res.ok) {
        if (res.status === 404) {
          setError("Salle non trouvée");
          return;
        }
        throw new Error("Erreur lors de la récupération des œuvres");
      }
      const data = await res.json();
      setRoom(data.room);
      setArtworks(Array.isArray(data.artworks) ? data.artworks : []);
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  // ---------- Modale œuvres ----------
  const openModal = (mode, artwork = null) => {
    setModalMode(mode);
    setEditingArtwork(artwork || null);

    if (mode === "edit" && artwork) {
      setFormData({
        title: artwork.title || "",
        description: artwork.description || "",
        imageUrl: artwork.imageUrl || "",
      });
      setImagePreview(artwork.imageUrl || null);
    } else {
      setFormData({ title: "", description: "", imageUrl: "" });
      setImagePreview(null);
    }
    setImageFile(null);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingArtwork(null);
    setFormData({ title: "", description: "", imageUrl: "" });
    setImageFile(null);
    setImagePreview(null);
    document.body.style.overflow = "";
  };

  // ESC pour fermer la modale d’œuvres
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // ---------- Modale salle ----------
  const openRoomModal = () => {
    if (room) {
      setRoomFormData({
        name: room.name || "",
        description: room.description || "",
        status: room.status || "active",
      });
    }
    setRoomModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeRoomModal = () => {
    setRoomModalOpen(false);
    setRoomFormData({ name: "", description: "", status: "active" });
    document.body.style.overflow = "";
  };

  // ESC pour fermer la modale de salle
  useEffect(() => {
    if (!roomModalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeRoomModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [roomModalOpen]);

  // ---------- Handlers ----------
  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!slug) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const res = await fetch(`/api/salles/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomFormData),
        cache: "no-store",
      });

      const ok = res.ok;
      const result = await res.json().catch(() => ({}));
      if (!ok) {
        throw new Error(result.error || "Erreur lors de la modification");
      }

      setRoom(result.room || { ...room, ...roomFormData });
      setMessage({
        type: "success",
        text: "✅ Informations de la salle mises à jour avec succès",
      });
      setTimeout(() => setMessage(null), 5000);

      // revalidation ISR de la page salle
      try {
        await fetch("/api/revalidate-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
          cache: "no-store",
        });
      } catch {}

      closeRoomModal();
    } catch (err) {
      setError(err.message || "Erreur lors de la modification");
      setMessage({
        type: "error",
        text: `❌ ${err.message || "Erreur lors de la modification"}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // si on choisit un nouveau fichier, on ignore l'URL précédente
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("image", imageFile);
      form.append("folder", "artworks"); // optionnel: côté API, placer sous /artworks

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
        cache: "no-store",
      });
      const ok = res.ok;
      const data = await res.json().catch(() => ({}));
      if (!ok || !data.imageUrl) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }
      return data.imageUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const title = formData.title.trim();
      const description = formData.description.trim();
      if (!title || !description) {
        throw new Error("Le titre et la description sont requis");
      }

      let imageUrl = formData.imageUrl?.trim();
      if (!imageUrl && imageFile) {
        imageUrl = await uploadImage();
      }
      if (!imageUrl) {
        throw new Error("Une image est requise");
      }

      const payload = { title, description, imageUrl };

      const res = await fetch(`/api/salles/${slug}/oeuvres`, {
        method: modalMode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body:
          modalMode === "add"
            ? JSON.stringify(payload)
            : JSON.stringify({ ...payload, artworkId: editingArtwork._id }),
        cache: "no-store",
      });

      const ok = res.ok;
      const data = await res.json().catch(() => ({}));
      if (!ok) {
        throw new Error(data.error || "Erreur lors de l'opération");
      }

      setMessage({
        type: "success",
        text:
          modalMode === "add"
            ? "✅ Œuvre ajoutée avec succès"
            : "✅ Œuvre modifiée avec succès",
      });
      setTimeout(() => setMessage(null), 5000);

      closeModal();
      await fetchArtworks();

      // revalidation ISR
      try {
        await fetch("/api/revalidate-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
          cache: "no-store",
        });
      } catch {}
    } catch (err) {
      setError(err.message || "Erreur");
      setMessage({ type: "error", text: `❌ ${err.message || "Erreur"} ` });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (artworkId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette œuvre ?")) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const res = await fetch(
        `/api/salles/${slug}/oeuvres?artworkId=${artworkId}`,
        {
          method: "DELETE",
          cache: "no-store",
        }
      );

      const ok = res.ok;
      const data = await res.json().catch(() => ({}));
      if (!ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setMessage({ type: "success", text: "✅ Œuvre supprimée avec succès" });
      setTimeout(() => setMessage(null), 5000);

      await fetchArtworks();

      // revalidation ISR
      try {
        await fetch("/api/revalidate-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
          cache: "no-store",
        });
      } catch {}
    } catch (err) {
      setError(err.message || "Erreur");
      setMessage({
        type: "error",
        text: `❌ ${err.message || "Erreur lors de la suppression"}`,
      });
    } finally {
      setSaving(false);
    }
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
        <p>Chargement des œuvres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card">
        <div className="message message-error">
          <strong>Erreur :</strong> {error}
        </div>
        <button onClick={fetchArtworks} className="admin-btn">
          Réessayer
        </button>
        <button
          onClick={() => router.back()}
          className="admin-btn admin-btn-secondary"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <Link href="/admin/salles" className="admin-back-button">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="admin-page-title" style={{ margin: 10 }}>
            Œuvres de {room?.name || room?.title || slug}
          </h1>
        </div>
        <p className="admin-page-subtitle">
          Gérez les œuvres présentes dans cette salle
        </p>
      </div>

      {message && <div className={messageClass}>{message.text}</div>}

      <div className="admin-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h3>Liste des œuvres ({artworks.length})</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={openRoomModal}
              className="admin-btn admin-btn-secondary"
            >
              <Settings size={16} /> Modifier la salle
            </button>
            <button onClick={() => openModal("add")} className="admin-btn">
              <Plus size={16} /> Ajouter une œuvre
            </button>
          </div>
        </div>

        {artworks.length === 0 ? (
          <p>Aucune œuvre dans cette salle. Commencez par en ajouter une !</p>
        ) : (
          <div className="artwork-list">
            {artworks.map((artwork) => (
              <div
                key={artwork._id}
                className="artwork-item"
                style={{
                  display: "flex",
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  border: "1px solid rgba(191, 167, 106, 0.83)",
                }}
              >
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title || "Œuvre"}
                  width={80}
                  height={80}
                  className="artwork-thumbnail"
                />
                <div className="artwork-info">
                  <h4 className="artwork-title">{artwork.title}</h4>
                  <p className="artwork-description">{artwork.description}</p>
                </div>
                <div className="artwork-actions">
                  <button
                    onClick={() => openModal("edit", artwork)}
                    className="admin-btn admin-btn-secondary"
                  >
                    <Edit size={16} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(artwork._id)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale œuvre */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="artwork-modal-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="artwork-modal-title" className="modal-title">
                {modalMode === "add" ? "Ajouter une œuvre" : "Modifier l'œuvre"}
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
                <label className="admin-form-label" htmlFor="art-title">
                  Titre de l'œuvre
                </label>
                <input
                  id="art-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="admin-form-input"
                  placeholder="Entrez le titre de l'œuvre"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="art-desc">
                  Description
                </label>
                <textarea
                  id="art-desc"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="admin-form-textarea"
                  placeholder="Décrivez l'œuvre..."
                  rows={6}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="art-file">
                  Image
                </label>
                <input
                  id="art-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="admin-form-input"
                />
                {/* Affiche l’existant si pas de fichier choisi en édition */}
                {!imagePreview && formData.imageUrl && (
                  <div style={{ marginTop: 12 }}>
                    <Image
                      src={formData.imageUrl}
                      alt="Image actuelle"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                  </div>
                )}
                {imagePreview && (
                  <div style={{ marginTop: 12 }}>
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover", borderRadius: 4 }}
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
                  disabled={saving || uploading}
                >
                  {uploading
                    ? "Upload en cours..."
                    : saving
                      ? "Enregistrement..."
                      : modalMode === "add"
                        ? "Ajouter"
                        : "Modifier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale salle */}
      {roomModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeRoomModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="room-modal-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="room-modal-title" className="modal-title">
                Modifier les informations de la salle
              </h2>
              <button
                onClick={closeRoomModal}
                className="modal-close"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="room-name">
                  Nom complet de la salle
                </label>
                <input
                  id="room-name"
                  type="text"
                  name="name"
                  value={roomFormData.name}
                  onChange={handleRoomInputChange}
                  required
                  className="admin-form-input"
                  placeholder="Ex: Grande Galerie Principale"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="room-desc">
                  Description
                </label>
                <textarea
                  id="room-desc"
                  name="description"
                  value={roomFormData.description}
                  onChange={handleRoomInputChange}
                  required
                  className="admin-form-textarea"
                  placeholder="Description affichée dans les tooltips..."
                  rows={4}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="room-status">
                  Statut
                </label>
                <select
                  id="room-status"
                  name="status"
                  value={roomFormData.status}
                  onChange={handleRoomInputChange}
                  className="admin-form-select"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">En maintenance</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeRoomModal}
                  className="admin-btn admin-btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="admin-btn" disabled={saving}>
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Une ligne d’œuvre = vignette | infos | actions */
        .artwork-item {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 12px 0;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }
        .artwork-item:first-child {
          border-top: none;
        }

        .artwork-thumbnail {
          border-radius: 6px;
          object-fit: cover;
          background: #f3f3f3;
        }
        .artwork-info {
          min-width: 0;
        }
        .artwork-title {
          margin: 0 0 4px;
        }
        .artwork-description {
          margin: 0;
          color: #6a6a6a;
          font-size: 0.92rem;
          line-height: 1.35;
        }
        .artwork-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-left: 16px;
        }
        @media (max-width: 768px) {
          .artwork-item {
            grid-template-columns: 80px 1fr;
          }
          .artwork-actions {
            grid-column: 1 / -1;
            flex-direction: row;
            padding-left: 0;
            margin-top: 8px;
            gap: 8px;
          }
        }

        .admin-back-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #444;
          text-decoration: none;
          padding: 6px 10px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          background: #fff;
          transition: background 0.2s ease;
        }
        .admin-back-button:hover {
          background: #f7f7f7;
        }
      `}</style>
    </div>
  );
}
