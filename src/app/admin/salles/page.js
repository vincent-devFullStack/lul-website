"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Edit, Settings, Eye } from "lucide-react";

export default function AdminSallesPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const messageClass = !message
    ? ""
    : message.type === "success"
      ? "mt-4 p-3 rounded-lg border bg-green-100 border-green-300 text-green-800 text-sm font-medium text-center"
      : "mt-4 p-3 rounded-lg border bg-red-100 border-red-300 text-red-800 text-sm font-medium text-center";

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/salles", { cache: "no-store" });
      if (!res.ok) throw new Error("Erreur lors de la récupération des salles");
      const data = await res.json();

      const sorted = Array.isArray(data)
        ? [...data].sort(
            (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
          )
        : [];
      setRooms(sorted);
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const openRoomModal = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      name: room?.name || room?.title || "",
      description: room?.description || "",
      status: room?.status || "active",
    });
    setRoomModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeRoomModal = () => {
    setRoomModalOpen(false);
    setEditingRoom(null);
    setRoomFormData({ name: "", description: "", status: "active" });
    document.body.style.overflow = "";
  };

  // ESC pour fermer la modale
  useEffect(() => {
    if (!roomModalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeRoomModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [roomModalOpen]);

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const res = await fetch(`/api/salles/${editingRoom.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomFormData),
        cache: "no-store",
      });

      const ok = res.ok;
      const data = await res.json().catch(() => ({}));
      if (!ok) {
        throw new Error(data.error || "Erreur lors de la modification");
      }

      // Optimistic update local
      setRooms((prev) =>
        prev.map((r) => (r.slug === editingRoom.slug ? data.room || r : r))
      );

      // Revalidation ISR de la page /rooms/[slug]
      try {
        await fetch("/api/revalidate-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: editingRoom.slug }),
          cache: "no-store",
        });
      } catch {
        // silencieux : la page se revalidera aussi via revalidate time
      }

      setMessage({
        type: "success",
        text: "✅ Informations de la salle mises à jour avec succès",
      });
      setTimeout(() => setMessage(null), 5000);

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

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
        <p>Chargement des salles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card">
        <div className="message message-error">
          <strong>Erreur :</strong> {error}
        </div>
        <button onClick={fetchRooms} className="admin-btn">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des salles</h1>
        <p className="admin-page-subtitle">
          Gérez les métadonnées et œuvres de vos salles
        </p>
      </div>

      {message && <div className={messageClass}>{message.text}</div>}

      {rooms.length === 0 ? (
        <div className="admin-card">
          <p>Aucune salle trouvée. Veuillez vérifier votre base de données.</p>
        </div>
      ) : (
        <div className="admin-grid">
          {rooms.map((room) => (
            <div key={room._id || room.slug} className="room-card">
              <h3 className="room-card-title">{room.name || room.title}</h3>
              <p className="room-card-meta">
                Slug: {room.slug} • {room.artworks?.length || 0} œuvre(s) •
                Statut: {room.status || "active"}
              </p>

              {room.description && (
                <p
                  style={{
                    color: "#6A6A6A",
                    fontSize: "0.9rem",
                    marginBottom: "16px",
                  }}
                >
                  {room.description}
                </p>
              )}

              <div className="room-card-actions">
                <button
                  onClick={() => openRoomModal(room)}
                  className="admin-btn admin-btn-secondary"
                >
                  <Edit size={16} /> Modifier
                </button>

                <Link
                  href={`/admin/salles/${room.slug}/oeuvres`}
                  className="admin-btn"
                >
                  <Settings size={16} /> Gérer
                </Link>

                <Link
                  href={`/rooms/${room.slug}`}
                  className="admin-btn admin-btn-secondary"
                  target="_blank"
                >
                  <Eye size={16} /> Voir
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {roomModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeRoomModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="edit-room-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="edit-room-title" className="modal-title">
                Modifier « {editingRoom?.name || editingRoom?.title} »
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
                <label className="admin-form-label" htmlFor="room-description">
                  Description
                </label>
                <textarea
                  id="room-description"
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
    </div>
  );
}
