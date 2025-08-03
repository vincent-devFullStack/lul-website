"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../../../styles/pages/contact.css";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");

  // ✅ Texte de définition du dictionnaire avec marquage des synonymes et sauts de ligne
  const dictionaryText =
    "1. Ouvrage didactique constitué par un ensemble d'articles dont l'entrée constitue un mot, indépendants les uns des autres et rangés dans un ordre déterminé, le plus souvent alphabétique. (Abréviation familière : dico.)<br><br>SYNONYMES : <span class='synonym'>glossaire</span> - <span class='synonym'>lexique</span>.<br><br>2. Partie d'un programme d'assemblage qui donne, sous forme imprimée, la liste des adresses symboliques et leurs adresses absolues ou translatables.";

  // ✅ Effect pour déclencher l'animation fade in up
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Effect pour l'animation machine à écrire
  useEffect(() => {
    if (!isVisible) return;

    let timeoutId;
    const startTyping = () => {
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < dictionaryText.length) {
          setTypewriterText(dictionaryText.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeNextChar, 30); // Vitesse de frappe
        }
      };

      // Délai avant de commencer l'écriture
      timeoutId = setTimeout(typeNextChar, 800);
    };

    startTyping();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible]);

  return (
    <>
      <div className="contact-wrapper">
        <div
          className={`contact-container ${
            isVisible ? "fade-in-up-active" : "fade-in-up-initial"
          }`}
        >
          <div className="contact-content">
            {/* ✅ Section définition du dictionnaire à gauche */}
            <div className="contact-text-section">
              <h2>Contactez-nous</h2>

              {/* ✅ Titre "Dictionnaire :" souligné */}
              <h3 className="dictionary-title">Dictionnaire :</h3>

              {/* ✅ Texte avec animation machine à écrire */}
              <div className="typewriter-container">
                <p
                  className="typewriter-text"
                  dangerouslySetInnerHTML={{
                    __html:
                      typewriterText +
                      '<span class="typewriter-cursor">|</span>',
                  }}
                />
              </div>
            </div>

            {/* ✅ Formulaire au centre */}
            <form className="contact-form">
              <div className="contact-form-item">
                <label htmlFor="name">Nom</label>
                <input type="text" id="name" name="name" />
              </div>
              <div className="contact-form-item">
                <label htmlFor="prenom">Prénom</label>
                <input type="text" id="prenom" name="prenom" />
              </div>
              <div className="contact-form-item">
                <label htmlFor="societe">Société</label>
                <input type="text" id="societe" name="societe" />
              </div>
              <div className="contact-form-item">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className="contact-form-item">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="4"></textarea>
              </div>
              <button type="submit">Envoyer</button>
            </form>

            {/* ✅ Image à droite du formulaire */}
            <div className="contact-image-wrapper">
              <Image
                src="/assets/enveloppe.webp"
                alt="Contactez-nous"
                width={300}
                height={300}
                className="contact-image"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
