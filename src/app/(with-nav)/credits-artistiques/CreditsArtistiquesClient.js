"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "@/styles/pages/credits-artistiques.css";

export default function CreditsArtistiquesClient() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const abortRef = useRef(null);

  // Crédit par défaut pour lul
  const defaultCredit = useMemo(
    () => ({
      _id: "default-lul-credit",
      author: "lul",
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
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch("/api/credits", { signal: controller.signal });
        let data = [];
        if (res.ok) {
          try {
            data = await res.json();
          } catch {
            // Pas de JSON valide -> on laisse data = []
          }
        }

        // Combine + dédoublonne par auteur (garde lul par défaut en priorité)
        const combined = [defaultCredit, ...(Array.isArray(data) ? data : [])];
        const uniqueByAuthor = Object.values(
          combined.reduce((acc, c) => {
            const key = (c.author || "").trim().toLowerCase();
            if (!acc[key] || c.isDefault) acc[key] = c;
            return acc;
          }, {})
        );

        // Tri : lul (isDefault) en premier, puis alphabétique
        const sorted = [...uniqueByAuthor].sort((a, b) => {
          if (a.isDefault) return -1;
          if (b.isDefault) return 1;
          return (a.author || "").localeCompare(b.author || "", "fr", {
            sensitivity: "base",
          });
        });

        setCredits(sorted);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Erreur lors du chargement des crédits:", err);
          setLoadError(
            "Impossible de charger les crédits pour le moment. Réessayez plus tard."
          );
          setCredits([defaultCredit]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [defaultCredit]);

  // animation d’entrée
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return (
      <time dateTime={date.toISOString()}>
        {date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    );
  };

  if (loading) {
    return (
      <div className="credits-loading" role="status" aria-live="polite">
        <p>Chargement des crédits artistiques…</p>
      </div>
    );
  }

  return (
    <main
      className={`credits-container ${
        isVisible ? "fade-in-up-active" : "fade-in-up-initial"
      }`}
    >
      <div className="credits-content">
        <h2 className="credits-title">Crédits artistiques</h2>

        <div className="credits-intro">
          <p>
            Cette page recense les artistes et créateurs dont les œuvres et
            citations sont présentées dans notre galerie virtuelle. Nous les
            remercions pour leur contribution.
          </p>
          {loadError && (
            <p className="credits-error" role="alert">
              {loadError}
            </p>
          )}
        </div>

        {credits.map((credit, index) => {
          const isInternalLink =
            typeof credit.link === "string" &&
            /^\/(?!\/)/.test(credit.link || "");

          return (
            <section
              key={credit._id || `${credit.author}-${index}`}
              className="credit-section"
            >
              <h3 className="credit-artist-name">
                {index + 1}. {credit.author}
                {credit.isDefault && (
                  <span className="credit-creator-badge">
                    {" "}
                    (Créateur du site)
                  </span>
                )}
              </h3>

              <div className="credit-details">
                {credit.role && (
                  <p>
                    <strong>Statut :</strong> {credit.role}
                  </p>
                )}

                {credit.quote && (
                  <div className="credit-quote-section">
                    <p>
                      <strong>Citation :</strong>
                    </p>
                    <blockquote className="credit-quote-text">
                      “{credit.quote}”
                    </blockquote>
                  </div>
                )}

                {credit.link && (
                  <p>
                    <strong>Plus d’informations :</strong>{" "}
                    {isInternalLink ? (
                      <Link
                        href={credit.link}
                        className="credit-link"
                        aria-label={
                          credit.isDefault
                            ? "Aller à la page À propos"
                            : `Visiter le site de ${credit.author}`
                        }
                      >
                        {credit.isDefault
                          ? "Page À propos"
                          : `Site de ${credit.author}`}
                      </Link>
                    ) : (
                      <a
                        href={credit.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="credit-link"
                        aria-label={`Ouvrir le site de ${credit.author} dans un nouvel onglet`}
                      >
                        {`Site de ${credit.author}`}
                      </a>
                    )}
                  </p>
                )}

                <p className="credit-date">
                  <strong>
                    {credit.isDefault ? "Statut :" : "Ajouté le :"}
                  </strong>{" "}
                  {credit.isDefault
                    ? "Créateur et gestionnaire de L'Iconodule"
                    : formatDate(credit.createdAt)}
                </p>

                {Number(credit.quotesCount) > 1 && (
                  <p>
                    <strong>Nombre de citations :</strong> {credit.quotesCount}
                  </p>
                )}
              </div>
            </section>
          );
        })}

        <div className="credits-footer">
          <h3>Informations générales</h3>
          <div className="credits-summary">
            <p>
              <strong>Total des contributeurs :</strong> {credits.length}{" "}
              {credits.length > 1 ? "artistes" : "artiste"}
            </p>
            <p>
              Les crédits sont générés automatiquement à partir des mementos
              ajoutés à la galerie. Chaque citation est accompagnée des
              informations sur son auteur.
            </p>
            <p>
              Pour toute question concernant les droits d’auteur ou pour
              signaler une erreur, n’hésitez pas à{" "}
              <Link href="/contact" className="credit-link">
                nous contacter
              </Link>
              .
            </p>
          </div>

          <p className="credits-last-update">
            Dernière mise à jour : {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>
    </main>
  );
}
