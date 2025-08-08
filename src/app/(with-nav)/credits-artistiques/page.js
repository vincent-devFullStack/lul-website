"use client";

import { useEffect, useState, useMemo } from "react";
import "@/styles/pages/credits-artistiques.css";

export default function CreditsArtistiques() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Crédit par défaut pour Lul simplifié
  const defaultCredit = useMemo(
    () => ({
      _id: "default-lul-credit",
      author: "Lul",
      role: "Gestionnaire du site et créateur",
      quote:
        "Bienvenue dans L'Iconodule, votre galerie virtuelle dédiée à l'art contemporain.",
      link: "/about",
      createdAt: "2024-01-01T00:00:00.000Z",
      quotesCount: 1,
      isDefault: true,
    }),
    []
  );

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits");
        if (response.ok) {
          const data = await response.json();

          // ✅ Combiner le crédit par défaut avec les crédits des mementos
          const allCredits = [defaultCredit, ...data];

          // ✅ Trier : Lul en premier, puis alphabétique
          const sortedCredits = allCredits.sort((a, b) => {
            if (a.isDefault) return -1;
            if (b.isDefault) return 1;
            return a.author.localeCompare(b.author, "fr", {
              sensitivity: "base",
            });
          });

          setCredits(sortedCredits);
        } else {
          console.warn(
            "API credits non disponible, affichage du crédit par défaut"
          );
          setCredits([defaultCredit]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des crédits:", error);
        setCredits([defaultCredit]);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [defaultCredit]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="credits-loading">
        <p>Chargement des crédits artistiques...</p>
      </div>
    );
  }

  return (
    <div
      className={`credits-container ${
        isVisible ? "fade-in-up-active" : "fade-in-up-initial"
      }`}
    >
      <div className="credits-content">
        <h1 className="credits-title">Crédits artistiques</h1>

        <div className="credits-intro">
          <p>
            Cette page recense tous les artistes et créateurs dont les œuvres et
            citations sont présentées dans notre galerie virtuelle. Nous leur
            rendons hommage et les remercions pour leur contribution artistique.
          </p>
        </div>

        {/* ✅ Liste des artistes sous forme de sections */}
        {credits.map((credit, index) => (
          <section key={credit._id} className="credit-section">
            <h2 className="credit-artist-name">
              {index + 1}. {credit.author}
              {credit.isDefault && (
                <span className="credit-creator-badge">
                  {" "}
                  (Créateur du site)
                </span>
              )}
            </h2>

            <div className="credit-details">
              <p>
                <strong>Statut :</strong> {credit.role}
              </p>

              <div className="credit-quote-section">
                <p>
                  <strong>Citation :</strong>
                </p>
                <blockquote className="credit-quote-text">
                  "{credit.quote}"
                </blockquote>
              </div>

              {credit.link && (
                <p>
                  <strong>Plus d'informations :</strong>{" "}
                  <a
                    href={credit.link}
                    target={credit.isDefault ? "_self" : "_blank"}
                    rel={credit.isDefault ? "" : "noopener noreferrer"}
                    className="credit-link"
                  >
                    {credit.isDefault ? "Page À propos" : "Lien vers son site"}
                  </a>
                </p>
              )}

              <p className="credit-date">
                <strong>{credit.isDefault ? "Statut :" : "Ajouté le :"}</strong>{" "}
                {credit.isDefault
                  ? "Créateur et gestionnaire de L'Iconodule"
                  : new Date(credit.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </p>

              {credit.quotesCount > 1 && (
                <p>
                  <strong>Nombre de citations :</strong> {credit.quotesCount}
                </p>
              )}
            </div>
          </section>
        ))}

        <div className="credits-footer">
          <h2>.Informations générales</h2>
          <div className="credits-summary">
            <p>
              <strong>Total des contributeurs :</strong> {credits.length}{" "}
              {credits.length > 1 ? "artistes" : "artiste"}
            </p>
            <p>
              Les crédits sont automatiquement générés à partir des mementos
              ajoutés à la galerie. Chaque citation est accompagnée des
              informations sur son auteur.
            </p>
            <p>
              Pour toute question concernant les droits d'auteur ou pour
              signaler une erreur, n'hésitez pas à{" "}
              <a href="/contact" className="credit-link">
                nous contacter
              </a>
              .
            </p>
          </div>

          <p className="credits-last-update">
            Dernière mise à jour :{" "}
            {new Date().toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
