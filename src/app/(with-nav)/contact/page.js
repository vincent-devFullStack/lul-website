"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../../../styles/pages/contact.css";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    prenom: "",
    societe: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  // ✅ NOUVELLE définition du contact
  const contactText =
    "<strong>nom masculin</strong><br><br><em>(latin contactus, de contingere, toucher)</em><br><br>1. État ou position de deux corps ou substances qui se touchent<br><br>2. État ou action de personnes qui sont en relation, qui communiquent entre elles<br><br>3. Personne avec qui on est en relation, avec qui on entre en rapport pour se procurer quelque chose, pour obtenir des renseignements";

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        submitting: false,
        submitted: false,
        error:
          "Veuillez remplir tous les champs obligatoires (Nom, Email, Message)",
      });
      return;
    }

    setStatus({
      submitting: true,
      submitted: false,
      error: null,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du message");
      }

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
      });

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        prenom: "",
        societe: "",
        email: "",
        message: "",
      });

      // Message de succès qui disparaît après 5 secondes
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, submitted: false }));
      }, 5000);
    } catch (error) {
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message,
      });
    }
  };

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
        if (currentIndex < contactText.length) {
          setTypewriterText(contactText.slice(0, currentIndex + 1));
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
            <div className="contact-text-section">
              {/* ✅ Texte avec animation machine à écrire */}
              <div className="typewriter-container">
                {/* ✅ Titre "Contact :" souligné */}
                <h3 className="contact-title">Contact :</h3>
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
            <form className="contact-form" onSubmit={handleSubmit}>
              {status.error && (
                <div className="form-error-message">{status.error}</div>
              )}
              {status.submitted && (
                <div className="form-success-message">
                  Votre message a été envoyé avec succès !
                </div>
              )}

              <div className="contact-form-item">
                <label htmlFor="name">
                  Nom <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form-item">
                <label htmlFor="prenom">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </div>
              <div className="contact-form-item">
                <label htmlFor="societe">Société</label>
                <input
                  type="text"
                  id="societe"
                  name="societe"
                  value={formData.societe}
                  onChange={handleChange}
                />
              </div>
              <div className="contact-form-item">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form-item">
                <label htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status.submitting}
                className={status.submitting ? "submitting" : ""}
              >
                {status.submitting ? "Envoi en cours..." : "Envoyer"}
              </button>
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
