"use client";

import { useEffect, useState } from "react";
import "@/styles/pages/mentions-legales.css";

export default function MentionsLegales() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`mentions-legales-container ${
        isVisible ? "fade-in-up-active" : "fade-in-up-initial"
      }`}
    >
      <div className="mentions-legales-content">
        <h1 className="mentions-legales-title">Mentions légales</h1>

        <section className="mentions-section">
          <h2>1. Éditeur du site</h2>
          <div className="mentions-info">
            <p>
              <strong>Nom du site :</strong> L'Iconodule
            </p>
            <p>
              <strong>Propriétaire :</strong> Maud Bonnal
            </p>
            <p>
              <strong>Statut :</strong> Projet artistique
            </p>
            <p>
              <strong>Email :</strong> contact@iconodule.fr
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>2. Hébergement</h2>
          <div className="mentions-info">
            <p>
              <strong>Hébergeur :</strong> o2switch
            </p>
            <p>
              <strong>Adresse :</strong> Chemin des Pardiaux, 63000
              Clermont-Ferrand, France
            </p>
            <p>
              <strong>Site web :</strong>{" "}
              <a
                href="https://o2switch.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://o2switch.fr
              </a>
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>3. Propriété intellectuelle</h2>
          <div className="mentions-info">
            <p>
              L'ensemble du contenu présent sur ce site (textes, images, vidéos,
              éléments graphiques, logos, icônes, etc.) est protégé par le droit
              d'auteur et appartient à leurs propriétaires respectifs.
            </p>
            <p>
              Les œuvres d'art présentées sur ce site sont la propriété de leurs
              auteurs respectifs. Toute reproduction, distribution ou
              utilisation commerciale non autorisée est strictement interdite.
            </p>
            <p>
              Le code source de ce site web est développé par Damien Mourot &
              Vincent Silvestri. Tous droits réservés.
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>4. Données personnelles</h2>
          <div className="mentions-info">
            <p>
              Conformément à la loi "Informatique et Libertés" du 6 janvier 1978
              modifiée et au Règlement Général sur la Protection des Données
              (RGPD), vous disposez d'un droit d'accès, de rectification, de
              portabilité et d'effacement de vos données.
            </p>
            <p>
              Les données collectées via le formulaire de contact sont utilisées
              uniquement pour répondre à vos demandes et ne sont en aucun cas
              transmises à des tiers.
            </p>
            <p>
              Pour exercer vos droits, vous pouvez nous contacter à l'adresse :
              <a href="mailto:contact@iconodule.fr">contact@iconodule.fr</a>
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>5. Cookies</h2>
          <div className="mentions-info">
            <p>
              Ce site utilise des cookies techniques nécessaires au bon
              fonctionnement de l'application, notamment pour la gestion des
              sessions utilisateur et l'authentification.
            </p>
            <p>
              Aucun cookie de tracking ou de publicité n'est utilisé sur ce
              site.
            </p>
            <p>
              Vous pouvez configurer votre navigateur pour refuser les cookies,
              mais cela pourrait affecter certaines fonctionnalités du site.
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>6. Responsabilité</h2>
          <div className="mentions-info">
            <p>
              Les informations présentes sur ce site sont fournies à titre
              informatif et éducatif. Nous nous efforçons de maintenir ces
              informations à jour et exactes, mais ne pouvons garantir leur
              exhaustivité ou leur précision.
            </p>
            <p>
              L'utilisation des informations présentes sur ce site se fait sous
              votre propre responsabilité.
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>7. Liens externes</h2>
          <div className="mentions-info">
            <p>
              Ce site peut contenir des liens vers des sites web externes. Nous
              ne sommes pas responsables du contenu de ces sites ni de leurs
              pratiques de confidentialité.
            </p>
            <p>
              Ces liens sont fournis à titre informatif et leur présence ne
              constitue pas une approbation du contenu des sites liés.
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>8. Droit applicable</h2>
          <div className="mentions-info">
            <p>
              Les présentes mentions légales sont soumises au droit français. En
              cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </div>
        </section>

        <section className="mentions-section">
          <h2>9. Contact</h2>
          <div className="mentions-info">
            <p>
              Pour toute question concernant ces mentions légales ou le site en
              général, vous pouvez nous contacter :
            </p>
            <p>
              <strong>Email :</strong>{" "}
              <a href="mailto:admin@liconodule.fr">admin@iconodule.fr</a>
            </p>
          </div>
        </section>

        <div className="mentions-footer">
          <p className="mentions-last-update">
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
