"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MementoModal from "@/components/MementoModal";
import "@/styles/pages/memento.css";

export default function Memento() {
  const [mementos, setMementos] = useState([]);
  const [selectedMemento, setSelectedMemento] = useState(null);

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  useEffect(() => {
    fetch("/api/memento")
      .then((res) => res.json())
      .then(setMementos);
  }, []);

  const openModal = (memento) => {
    setSelectedMemento(memento);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMemento(null);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <div className="memento-grid">
        {mementos.map((m) => (
          <div className="memento-card" key={m._id}>
            <div className="memento-img-wrapper">
              <Image
                src={m.imageUrl}
                alt={m.author}
                width={300}
                height={180}
                className="memento-img"
              />
            </div>
            <div className="memento-content">
              <blockquote className="memento-quote">
                {truncateText(m.quote)}
                {m.quote.length > 150 && (
                  <button
                    onClick={() => openModal(m)}
                    className="expand-button"
                  >
                    Voir plus
                  </button>
                )}
              </blockquote>
              <div className="memento-author">{m.author}</div>
              <div className="memento-role">{m.role}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedMemento && (
        <MementoModal memento={selectedMemento} onClose={closeModal} />
      )}
    </>
  );
}
