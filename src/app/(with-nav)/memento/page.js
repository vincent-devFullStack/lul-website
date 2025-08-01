"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/pages/memento.css";

export default function Memento() {
  const [mementos, setMementos] = useState([]);

  useEffect(() => {
    fetch("/api/memento") // Modifié ici : retiré le 's'
      .then((res) => res.json())
      .then(setMementos);
  }, []);

  return (
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
            <blockquote className="memento-quote">"{m.quote}"</blockquote>
            <div className="memento-author">{m.author}</div>
            <div className="memento-role">{m.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
