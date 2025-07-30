/**
 * Script pour initialiser le contenu par défaut de la page À propos
 * À exécuter une seule fois pour créer le premier contenu
 */

import { connectToDatabase, createOrUpdateContent } from "../../lib/mongodb.js";

async function initializeAboutContent() {
  try {
    console.log("🚀 Initialisation du contenu de la page À propos...");
    
    const defaultContent = {
      title: "À propos de moi",
      content: `Bienvenue dans mon univers artistique et culturel. Cette page vous permettra de mieux comprendre ma démarche, mon parcours et ma passion pour l'art.

Passionnée par l'histoire de l'art et la transmission culturelle, j'ai créé cet espace pour partager ma collection et mes découvertes avec vous. Chaque œuvre exposée dans ce musée virtuel a été soigneusement sélectionnée pour sa beauté, son histoire et sa signification.

Mon parcours m'a menée à travers différentes périodes artistiques, des maîtres classiques aux créations contemporaines. Cette diversité se reflète dans la richesse des collections que vous découvrirez en parcourant les différentes salles.

L'art n'est pas seulement une affaire d'esthétique, c'est un langage universel qui nous permet de communiquer au-delà des mots et des frontières. C'est cette conviction qui guide mes choix curatoriales et anime ma passion pour le partage culturel.

Je vous invite à explorer chaque salle, à prendre le temps de contempler chaque œuvre et à vous laisser porter par les émotions qu'elles suscitent. N'hésitez pas à revenir régulièrement, car ce musée virtuel évolue constamment avec de nouvelles acquisitions et expositions.`
    };

    const result = await createOrUpdateContent("about-page", defaultContent);
    
    console.log("✅ Contenu initialisé avec succès !");
    console.log("📄 ID du document :", result._id);
    console.log("📝 Titre :", result.title);
    console.log("📊 Longueur du contenu :", result.content.length, "caractères");
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation :", error);
  }
}

// Exécuter le script
initializeAboutContent();