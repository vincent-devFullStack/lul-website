"use client";

import { useEffect, useRef, useState } from "react";
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
    website: "", // honeypot
  });
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  const timersRef = useRef([]);

  const contactText =
    "<strong>nom masculin</strong><br><br><em>(latin contactus, de contingere, toucher)</em><br><br>1. État ou position de deux corps ou substances qui se touchent<br><br>2. État ou action de personnes qui sont en relation, qui communiquent entre elles<br><br>3. Personne avec qui on est en relation, avec qui on entre en rapport pour se procurer quelque chose, pour obtenir des renseignements";

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        submitting: false,
        submitted: false,
        error:
          "Veuillez remplir tous les champs obligatoires (Nom, Email, Message)",
      });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: null });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // inclut le honeypot `website`
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        // si le backend ne renvoie pas de JSON valide
      }

      if (!response.ok) {
        throw new Error(data?.error || "Erreur lors de l'envoi du message");
      }

      setStatus({ submitting: false, submitted: true, error: null });
      setFormData({
        name: "",
        prenom: "",
        societe: "",
        email: "",
        message: "",
        website: "",
      });

      const t = window.setTimeout(
        () => setStatus((prev) => ({ ...prev, submitted: false })),
        5000
      );
      timersRef.current.push(t);
    } catch (error) {
      setStatus({
        submitting: false,
        submitted: false,
        error: error?.message || "Erreur réseau",
      });
    }
  };

  // Animation d'entrée
  useEffect(() => {
    const t = window.setTimeout(() => setIsVisible(true), 100);
    timersRef.current.push(t);
    const timers = timersRef.current;
    return () => timers.forEach((id) => clearTimeout(id));
  }, []);

  // Effet machine à écrire
  useEffect(() => {
    if (!isVisible) return;
    let idx = 0;

    const step = () => {
      if (idx < contactText.length) {
        setTypewriterText(contactText.slice(0, idx + 1));
        idx += 1;
        const t = window.setTimeout(step, 30);
        timersRef.current.push(t);
      }
    };

    const start = window.setTimeout(step, 800);
    timersRef.current.push(start);
  }, [isVisible]);

  return (
    <main className="contact-wrapper">
      <div
        className={`contact-container ${
          isVisible ? "fade-in-up-active" : "fade-in-up-initial"
        }`}
      >
        <div className="contact-content">
          <div className="contact-text-section">
            <div className="typewriter-container">
              <h1 className="contact-title">Contact :</h1>
              <p
                className="typewriter-text"
                aria-live="polite"
                dangerouslySetInnerHTML={{
                  __html:
                    typewriterText +
                    '<span class="typewriter-cursor" aria-hidden="true">|</span>',
                }}
              />
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
            autoComplete="on"
            noValidate
          >
            {/* Zone d’état accessible */}
            <div role="status" aria-live="polite" className="sr-only">
              {status.submitting
                ? "Envoi en cours…"
                : status.submitted
                  ? "Message envoyé."
                  : status.error
                    ? `Erreur : ${status.error}`
                    : ""}
            </div>

            {/* Honeypot anti-spam (caché visuellement) */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-5000px" }}
            >
              <label htmlFor="website">Votre site web (laissez vide)</label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

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
                autoComplete="family-name"
                autoCapitalize="words"
                spellCheck={false}
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
                autoComplete="given-name"
                autoCapitalize="words"
                spellCheck={false}
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
                autoComplete="organization"
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
                autoComplete="email"
                inputMode="email"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            <div className="contact-form-item">
              <label htmlFor="message">
                Message <span className="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                autoComplete="off"
                maxLength={4000}
              />
              {/* aligné avec l'API */}
            </div>

            <button
              type="submit"
              disabled={status.submitting}
              className={status.submitting ? "submitting" : ""}
            >
              {status.submitting ? "Envoi en cours..." : "Envoyer"}
            </button>
          </form>

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
    </main>
  );
}
