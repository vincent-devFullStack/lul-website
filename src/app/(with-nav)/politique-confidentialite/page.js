"use client";

import { useEffect, useState } from "react";
import "@/styles/pages/politique-confidentialite.css";

export default function PolitiqueConfidentialite() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className={`politique-container ${
        isVisible ? "fade-in-up-active" : "fade-in-up-initial"
      }`}
    >
      <div className="politique-content">
        <h1 className="politique-title">Politique de confidentialité</h1>

        <section className="politique-section" aria-labelledby="intro">
          <h2 id="intro">1. Introduction</h2>
          <div className="politique-info">
            <p>
              La présente politique de confidentialité décrit comment
              L'Iconodule collecte, utilise et protège vos informations
              personnelles lorsque vous utilisez notre site web.
            </p>
            <p>
              Nous nous engageons à protéger votre vie privée et à traiter vos
              données personnelles de manière transparente, conformément au
              Règlement Général sur la Protection des Données (RGPD) et à la loi
              française "Informatique et Libertés".
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="responsable">
          <h2 id="responsable">2. Responsable du traitement</h2>
          <div className="politique-info">
            <p>
              <strong>Responsable :</strong> Maud Bonnal
            </p>
            <p>
              <strong>Site web :</strong> L'Iconodule
            </p>
            <p>
              <strong>Email de contact :</strong>{" "}
              <a href="mailto:contact@iconodule.fr">contact@iconodule.fr</a>
            </p>
            <p>
              <strong>Hébergeur :</strong> o2switch, Chemin des Pardiaux, 63000
              Clermont-Ferrand, France
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="donnees">
          <h2 id="donnees">3. Données collectées</h2>
          <div className="politique-info">
            <h3>3.1 Données collectées automatiquement</h3>
            <ul>
              <li>
                <strong>Données techniques :</strong> Adresse IP, type de
                navigateur, système d'exploitation, pages visitées, durée de
                visite
              </li>
              <li>
                <strong>Cookies techniques :</strong> Nécessaires au
                fonctionnement du site (session utilisateur, authentification)
              </li>
            </ul>

            <h3>3.2 Données collectées volontairement</h3>
            <ul>
              <li>
                <strong>Formulaire de contact :</strong> Nom, prénom
                (optionnel), société (optionnel), adresse e-mail, message
              </li>
              <li>
                <strong>Compte administrateur :</strong> Adresse e-mail, mot de
                passe chiffré
              </li>
            </ul>

            <h3>3.3 Données non collectées</h3>
            <p>
              Nous ne collectons <strong>aucune donnée sensible</strong> telle
              que : origine raciale, opinions politiques, croyances religieuses,
              données de santé, orientation sexuelle.
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="finalites">
          <h2 id="finalites">4. Finalités du traitement</h2>
          <div className="politique-info">
            <h3>4.1 Gestion du site web</h3>
            <ul>
              <li>Fonctionnement technique du site</li>
              <li>Amélioration de l'expérience utilisateur</li>
              <li>Maintenance et sécurité</li>
            </ul>

            <h3>4.2 Communication</h3>
            <ul>
              <li>Réponse aux demandes via le formulaire de contact</li>
              <li>
                Information sur les expositions et événements (si demandé)
              </li>
            </ul>

            <h3>4.3 Administration</h3>
            <ul>
              <li>Gestion des comptes administrateurs</li>
              <li>Modération du contenu</li>
              <li>Statistiques anonymisées de fréquentation</li>
            </ul>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="bases">
          <h2 id="bases">5. Base juridique du traitement</h2>
          <div className="politique-info">
            <p>Le traitement de vos données personnelles repose sur :</p>
            <ul>
              <li>
                <strong>Intérêt légitime :</strong> Fonctionnement du site,
                amélioration des services, sécurité
              </li>
              <li>
                <strong>Consentement :</strong> Utilisation du formulaire de
                contact
              </li>
              <li>
                <strong>Exécution contractuelle :</strong> Gestion des comptes
                administrateurs
              </li>
              <li>
                <strong>Obligation légale :</strong> Conservation des logs de
                connexion (sécurité informatique)
              </li>
            </ul>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="duree">
          <h2 id="duree">6. Durée de conservation</h2>
          <div className="politique-info">
            <ul>
              <li>
                <strong>Messages de contact :</strong> 3 ans maximum
              </li>
              <li>
                <strong>Logs de connexion :</strong> 12 mois (obligation légale)
              </li>
              <li>
                <strong>Comptes administrateurs :</strong> Jusqu'à suppression
                du compte
              </li>
              <li>
                <strong>Cookies techniques :</strong> Durée de la session ou 30
                jours maximum
              </li>
              <li>
                <strong>Données anonymisées :</strong> Conservation illimitée
                (plus de caractère personnel)
              </li>
            </ul>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="dest">
          <h2 id="dest">7. Destinataires des données</h2>
          <div className="politique-info">
            <p>Vos données personnelles sont accessibles uniquement à :</p>
            <ul>
              <li>
                <strong>L'équipe de L'Iconodule :</strong> Gestion du site et
                communication
              </li>
              <li>
                <strong>Hébergeur (o2switch) :</strong> Cadre strict de
                l'hébergement technique
              </li>
              <li>
                <strong>Aucun tiers :</strong> Pas de vente, location ni partage
                à des tiers
              </li>
            </ul>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="transferts">
          <h2 id="transferts">8. Transferts internationaux</h2>
          <div className="politique-info">
            <p>
              Vos données sont hébergées en France (o2switch, Clermont-Ferrand)
              et ne font l'objet d'aucun transfert vers des pays tiers.
            </p>
            <p>
              Elles restent donc soumises à la réglementation européenne (RGPD)
              et française.
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="securite">
          <h2 id="securite">9. Sécurité des données</h2>
          <div className="politique-info">
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              pour protéger vos données :
            </p>
            <ul>
              <li>
                <strong>Chiffrement :</strong> HTTPS sur l'ensemble du site
              </li>
              <li>
                <strong>Mots de passe :</strong> Hachage sécurisé (bcrypt)
              </li>
              <li>
                <strong>Accès restreint :</strong> Authentification obligatoire
                pour l'administration
              </li>
              <li>
                <strong>Sauvegarde :</strong> Sauvegardes régulières et
                sécurisées
              </li>
              <li>
                <strong>Mise à jour :</strong> Maintenance de sécurité régulière
              </li>
            </ul>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="cookies">
          <h2 id="cookies">10. Cookies et technologies similaires</h2>
          <div className="politique-info">
            <h3>10.1 Cookies utilisés</h3>
            <ul>
              <li>
                <strong>Cookies de session :</strong> Authentification et
                navigation (supprimés à la fermeture du navigateur)
              </li>
              <li>
                <strong>Cookies de fonctionnement :</strong> Préférences
                utilisateur (30 jours maximum)
              </li>
            </ul>

            <h3>10.2 Cookies non utilisés</h3>
            <p>
              Nous n'utilisons <strong>aucun cookie de :</strong>
            </p>
            <ul>
              <li>Tracking publicitaire</li>
              <li>Réseaux sociaux</li>
              <li>Analyse comportementale</li>
              <li>Géolocalisation</li>
            </ul>

            <h3>10.3 Gestion des cookies</h3>
            <p>
              Vous pouvez configurer votre navigateur pour refuser les cookies,
              mais certaines fonctionnalités du site pourraient être affectées.
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="droits">
          <h2 id="droits">11. Vos droits</h2>
          <div className="politique-info">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>

            <h3>11.1 Droit d'accès</h3>
            <p>
              Vous pouvez demander l'accès à toutes vos données personnelles que
              nous détenons.
            </p>

            <h3>11.2 Droit de rectification</h3>
            <p>
              Vous pouvez demander la correction de données inexactes ou
              incomplètes.
            </p>

            <h3>11.3 Droit à l'effacement</h3>
            <p>
              Vous pouvez demander la suppression de vos données personnelles
              dans certaines conditions.
            </p>

            <h3>11.4 Droit à la limitation</h3>
            <p>
              Vous pouvez demander la limitation du traitement de vos données.
            </p>

            <h3>11.5 Droit à la portabilité</h3>
            <p>
              Vous pouvez récupérer vos données dans un format structuré et
              lisible.
            </p>

            <h3>11.6 Droit d'opposition</h3>
            <p>
              Vous pouvez vous opposer au traitement de vos données pour des
              raisons légitimes.
            </p>

            <h3>11.7 Exercice de vos droits</h3>
            <p>
              Pour exercer ces droits, contactez-nous à :{" "}
              <a href="mailto:contact@iconodule.fr">contact@iconodule.fr</a>
            </p>
            <p>
              Nous vous répondrons dans un délai maximum de{" "}
              <strong>30 jours</strong>.
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="reclamation">
          <h2 id="reclamation">12. Réclamation</h2>
          <div className="politique-info">
            <p>
              Si vous estimez que le traitement de vos données personnelles
              constitue une violation du RGPD, vous pouvez saisir la CNIL :
            </p>
            <p>
              <strong>
                Commission Nationale de l'Informatique et des Libertés (CNIL)
              </strong>
              <br />
              3 Place de Fontenoy - TSA 80715
              <br />
              75334 PARIS CEDEX 07
              <br />
              Téléphone : 01 53 73 22 22
              <br />
              Site web :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.cnil.fr
              </a>
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="mineurs">
          <h2 id="mineurs">13. Mineurs</h2>
          <div className="politique-info">
            <p>
              Notre site s'adresse à un public majeur. Nous ne collectons pas
              sciemment de données personnelles concernant des mineurs de moins
              de 16 ans.
            </p>
            <p>
              Si nous apprenons qu'un mineur nous a fourni des données
              personnelles, nous les supprimerons immédiatement.
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="modifs">
          <h2 id="modifs">14. Modifications de la politique</h2>
          <div className="politique-info">
            <p>
              Cette politique de confidentialité peut être modifiée
              occasionnellement. Nous vous informerons de tout changement
              significatif en mettant à jour la date de dernière modification.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour
              rester informé.
            </p>
          </div>
        </section>

        <section className="politique-section" aria-labelledby="contact">
          <h2 id="contact">15. Contact</h2>
          <div className="politique-info">
            <p>
              Pour toute question concernant cette politique de confidentialité
              ou le traitement de vos données personnelles :
            </p>
            <p>
              <strong>Email :</strong>{" "}
              <a href="mailto:admin@iconodule.fr">admin@iconodule.fr</a>
              <br />
              <strong>Objet :</strong> &laquo; Données personnelles — [Votre
              demande] &raquo;
            </p>
            <p>
              Nous nous engageons à vous répondre dans les meilleurs délais.
            </p>
          </div>
        </section>

        <footer className="politique-footer">
          <p className="politique-last-update">
            Dernière mise à jour :{" "}
            {new Date().toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="politique-version">Version 1.0</p>
        </footer>
      </div>
    </main>
  );
}
