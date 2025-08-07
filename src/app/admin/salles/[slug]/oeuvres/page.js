"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Trash2, Plus, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminOeuvresPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [room, setRoom] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
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
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchArtworks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/salles/${slug}/oeuvres`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Salle non trouvée");
        } else {
          throw new Error("Erreur lors de la récupération des œuvres");
        }
        return;
      }

      const data = await response.json();
      setRoom(data.room);
      setArtworks(data.artworks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchArtworks();
    }
  }, [slug, fetchArtworks]);

  const openModal = (mode, artwork = null) => {
    setModalMode(mode);
    setEditingArtwork(artwork);

    if (mode === "edit" && artwork) {
      setFormData({
        title: artwork.title,
        description: artwork.description,
        imageUrl: artwork.imageUrl,
      });
      setImagePreview(artwork.imageUrl);
    } else {
      setFormData({ title: "", description: "", imageUrl: "" });
      setImagePreview(null);
    }

    setImageFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingArtwork(null);
    setFormData({ title: "", description: "", imageUrl: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const openRoomModal = () => {
    if (room) {
      setRoomFormData({
        name: room.name || "",
        description: room.description || "",
        status: room.status || "active",
      });
    }
    setRoomModalOpen(true);
  };

  const closeRoomModal = () => {
    setRoomModalOpen(false);
    setRoomFormData({
      name: "",
      description: "",
      status: "active",
    });
  };

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/salles/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la modification");
      }

      const result = await response.json();

      setMessage({
        type: "success",
        text: "Informations de la salle mises à jour avec succès",
      });

      setRoom(result.room);
      closeRoomModal();

      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);
      const form = new FormData();
      form.append("image", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      if (!imageUrl) {
        setError("Une image est requise");
        return;
      }

      const dataToSend = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: imageUrl,
      };

      let response;
      if (modalMode === "add") {
        response = await fetch(`/api/salles/${slug}/oeuvres`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
      } else {
        response = await fetch(`/api/salles/${slug}/oeuvres`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...dataToSend,
            artworkId: editingArtwork._id,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'opération");
      }

      setMessage({
        type: "success",
        text:
          modalMode === "add"
            ? "Œuvre ajoutée avec succès"
            : "Œuvre modifiée avec succès",
      });

      closeModal();
      await fetchArtworks();

      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (artworkId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette œuvre ?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/salles/${slug}/oeuvres?artworkId=${artworkId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      setMessage({
        type: "success",
        text: "Œuvre supprimée avec succès",
      });

      await fetchArtworks();

      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des œuvres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card">
        <div className="message message-error">
          <strong>Erreur:</strong> {error}
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
          <Link href="/admin/salles" className="admin-back-button"></Link>

          <h1 className="admin-page-title" style={{ margin: 0 }}>
            Œuvres de {room?.title || slug}
          </h1>
        </div>
        <p className="admin-page-subtitle">
          Gérez les œuvres présentes dans cette salle
        </p>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

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
              <div key={artwork._id} className="artwork-item">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
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

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === "add" ? "Ajouter une œuvre" : "Modifier l'œuvre"}
              </h2>
              <button onClick={closeModal} className="modal-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label">Titre de l'œuvre</label>
                <input
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
                <label className="admin-form-label">Description</label>
                <textarea
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
                <label className="admin-form-label">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="admin-form-input"
                />
                {imagePreview && (
                  <div style={{ marginTop: "12px" }}>
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover", borderRadius: "4px" }}
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
                  disabled={uploading}
                  className="admin-btn"
                >
                  {uploading
                    ? "Upload en cours..."
                    : modalMode === "add"
                      ? "Ajouter"
                      : "Modifier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {roomModalOpen && (
        <div className="modal-overlay" onClick={closeRoomModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Modifier les informations de la salle
              </h2>
              <button onClick={closeRoomModal} className="modal-close">
                ×
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Nom complet de la salle
                </label>
                <input
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
                <label className="admin-form-label">Description</label>
                <textarea
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
                <label className="admin-form-label">Statut</label>
                <select
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
                <button type="submit" className="admin-btn">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
