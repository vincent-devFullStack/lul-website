"use client";

import { useEffect, useState } from "react";
import "@/styles/pages/mentions-legales.css";

export default function MentionsLegalesClient() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className={`mentions-legales-container ${
        isVisible ? "fade-in-up-active" : "fade-in-up-initial"
      }`}
    >
      <div className="mentions-legales-content">
        <h2 className="mentions-legales-title">Mentions légales</h2>

        <section className="mentions-section" aria-labelledby="editeur">
          <h3 id="editeur">1. Éditeur du site</h3>
          <address className="mentions-info not-italic">
            <p>
              <strong>Nom du site :</strong> L'Iconodule
            </p>
            <p>
              <strong>Propriétaire :</strong> lul
            </p>
            <p>
              <strong>Statut :</strong> Projet artistique
            </p>
            <p>
              <strong>Email :</strong>{" "}
              <a href="mailto:contact@iconodule.fr">contact@iconodule.fr</a>
            </p>
          </address>
        </section>

        <section className="mentions-section" aria-labelledby="hebergeur">
          <h3 id="hebergeur">2. Hébergement</h3>
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

        <section className="mentions-section" aria-labelledby="pi">
          <h3 id="pi">3. Propriété intellectuelle</h3>
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
              Le code source de ce site web est développé par Damien Mourot
              &amp; Vincent Silvestri. Tous droits réservés.
            </p>
          </div>
        </section>

        <section className="mentions-section" aria-labelledby="donnees">
          <h3 id="donnees">4. Données personnelles</h3>
          <div className="mentions-info">
            <p>
              Conformément à la loi « Informatique et Libertés » du 6 janvier
              1978 modifiée et au RGPD, vous disposez d'un droit d'accès, de
              rectification, de portabilité et d'effacement de vos données.
            </p>
            <p>
              Les données collectées via le formulaire de contact sont utilisées
              uniquement pour répondre à vos demandes et ne sont en aucun cas
              transmises à des tiers.
            </p>
            <p>
              Pour exercer vos droits, écrivez-nous à{" "}
              <a href="mailto:contact@iconodule.fr">contact@iconodule.fr</a>.
            </p>
          </div>
        </section>

        <section className="mentions-section" aria-labelledby="cookies">
          <h3 id="cookies">5. Cookies</h3>
          <div className="mentions-info">
            <p>
              Ce site utilise des cookies techniques nécessaires au bon
              fonctionnement de l'application, notamment pour la gestion des
              sessions utilisateur et l'authentification.
            </p>
            <p>Aucun cookie de tracking ou publicitaire n'est utilisé.</p>
            <p>
              Vous pouvez configurer votre navigateur pour refuser les cookies,
              mais cela peut affecter certaines fonctionnalités.
            </p>
          </div>
        </section>

        <section className="mentions-section" aria-labelledby="responsabilite">
          <h3 id="responsabilite">6. Responsabilité</h3>
          <div className="mentions-info">
            <p>
              Les informations présentes sur ce site sont fournies à titre
              informatif. Nous nous efforçons de les maintenir à jour et
              exactes, sans garantir leur exhaustivité.
            </p>
            <p>
              L'utilisation des informations présentes sur ce site se fait sous
              votre propre responsabilité.
            </p>
          </div>
        </section>

        <section className="mentions-section" aria-labelledby="liens">
          <h3 id="liens">7. Liens externes</h3>
          <div className="mentions-info">
            <p>
              Ce site peut contenir des liens vers des sites web externes. Nous
              ne sommes pas responsables de leur contenu ni de leurs pratiques
              de confidentialité.
            </p>
            <p>
              Ces liens sont fournis à titre informatif et ne constituent pas
              une approbation.
            </p>
          </div>
        </section>

        <section className="mentions-section" aria-labelledby="droit">
          <h3 id="droit">8. Droit applicable</h3>
          <div className="mentions-info">
            <p>
              Les présentes mentions légales sont soumises au droit français. En
              cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </div>
        </section>

        <section className="mentions-section" aria-labelledby="contact">
          <h3 id="contact">9. Contact</h3>
          <div className="mentions-info">
            <p>Pour toute question concernant ces mentions légales :</p>
            <p>
              <strong>Email :</strong>{" "}
              <a href="mailto:admin@iconodule.fr">admin@iconodule.fr</a>
            </p>
          </div>
        </section>

        <footer className="mentions-footer">
          <p className="mentions-last-update">
            Dernière mise à jour :{" "}
            {new Date().toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </footer>
      </div>
    </main>
  );
}
