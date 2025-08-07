"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Settings, Eye } from "lucide-react";

export default function AdminSallesPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/salles");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des salles");
      }

      const data = await response.json();
      // Tri par displayOrder pour garantir l'ordre numérique
      const sortedRooms = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setRooms(sortedRooms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openRoomModal = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      name: room.name || "",
      description: room.description || "",
      status: room.status || "active",
    });
    setRoomModalOpen(true);
  };

  const closeRoomModal = () => {
    setRoomModalOpen(false);
    setEditingRoom(null);
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
      const response = await fetch(`/api/salles/${editingRoom.slug}`, {
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

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.slug === editingRoom.slug ? result.room : room
        )
      );

      closeRoomModal();

      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des salles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card">
        <div className="message message-error">
          <strong>Erreur:</strong> {error}
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

      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      {rooms.length === 0 ? (
        <div className="admin-card">
          <p>Aucune salle trouvée. Veuillez vérifier votre base de données.</p>
        </div>
      ) : (
        <div className="admin-grid">
          {rooms.map((room) => (
            <div key={room._id} className="room-card">
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
        <div className="modal-overlay" onClick={closeRoomModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Modifier "{editingRoom?.name || editingRoom?.title}"
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
