# Guide d'Administration du Musée Virtuel

## 🎯 Vue d'ensemble

Le système d'administration vous permet de gérer les œuvres de votre musée virtuel de manière intuitive et sécurisée.

## 🚀 Accès à l'administration

1. **Connexion requise** : Vous devez être connecté pour accéder à l'interface d'administration
2. **Point d'entrée** : Depuis la page d'accueil, cliquez sur le bouton "Administration" (visible uniquement si connecté)
3. **URL directe** : `/admin/salles`

## 📁 Architecture

```
/admin/
├── salles/                    # Liste toutes les salles
│   └── [slug]/
│       └── oeuvres/          # Gestion des œuvres d'une salle
```

## 🏛️ Gestion des salles

### Page : `/admin/salles`

- **Vue d'ensemble** : Affiche toutes les salles avec le nombre d'œuvres
- **Actions disponibles** :
  - 🎨 **Gérer les œuvres** : Accède à la gestion des œuvres de la salle
  - 👁️ **Voir la salle** : Ouvre la salle en mode visiteur (nouvel onglet)

## 🎨 Gestion des œuvres

### Page : `/admin/salles/[slug]/oeuvres`

#### Fonctionnalités principales :

1. **Liste des œuvres** avec aperçu, titre et description
2. **Ajout d'œuvres** via modal intuitif
3. **Modification d'œuvres** existantes
4. **Suppression d'œuvres** avec confirmation

#### Processus d'ajout/modification :

1. **Cliquer sur "➕ Ajouter une œuvre"** ou "✏️ Modifier" sur une œuvre existante
2. **Remplir le formulaire** :
   - **Titre** : Nom de l'œuvre (requis)
   - **Description** : Description détaillée (requis)
   - **Image** : Fichier image à uploader (requis)
3. **Upload automatique** : L'image est automatiquement uploadée et redimensionnée
4. **Validation** : Vérification côté client et serveur
5. **Confirmation** : Message de succès ou d'erreur

## 📸 Upload d'images

### Contraintes techniques :
- **Formats acceptés** : JPG, PNG, WebP
- **Taille maximale** : 5MB par fichier
- **Stockage** : `/public/uploads/artworks/`
- **Noms de fichiers** : UUIDs générés automatiquement

### Optimisation :
- Les images conservent leur qualité originale
- Aperçu immédiat dans le formulaire
- URLs générées automatiquement

## 🔒 Sécurité

### Protection d'accès :
- **Authentification obligatoire** pour toutes les routes admin
- **Validation serveur** pour tous les inputs
- **Sanitisation** des données (trim, échappement)
- **Gestion d'erreurs** complète avec messages explicites

### Validation des données :
- **Côté client** : Validation immédiate des formulaires
- **Côté serveur** : Double validation pour éviter les injections
- **Upload sécurisé** : Vérification des types MIME et tailles

## 🛠️ API Endpoints

### Salles
- `GET /api/salles` - Liste toutes les salles

### Œuvres
- `GET /api/salles/[slug]/oeuvres` - Récupère les œuvres d'une salle
- `POST /api/salles/[slug]/oeuvres` - Ajoute une œuvre
- `PUT /api/salles/[slug]/oeuvres` - Modifie une œuvre
- `DELETE /api/salles/[slug]/oeuvres?artworkId=xxx` - Supprime une œuvre

### Upload
- `POST /api/upload` - Upload d'image avec validation

## 🎯 Workflow recommandé

1. **Connexion** à votre compte administrateur
2. **Navigation** vers l'administration depuis l'accueil
3. **Sélection** de la salle à modifier
4. **Ajout/modification** des œuvres via les modales
5. **Vérification** en visitant la salle côté public

## ⚠️ Points d'attention

- **Sauvegarde** : Les modifications sont immédiates et irréversibles
- **Images** : Assurez-vous de la qualité avant upload
- **Descriptions** : Privilégiez des textes détaillés et engaging
- **Cohérence** : Maintenez un style uniforme entre les œuvres

## 🆘 Résolution de problèmes

### Erreurs communes :
- **"Salle non trouvée"** : Vérifiez le slug de la salle
- **"Upload failed"** : Vérifiez la taille et le format de l'image
- **"Erreur de connexion"** : Rechargez la page et reconnectez-vous

### Support :
- Les messages d'erreur sont explicites
- Bouton "Réessayer" disponible en cas d'échec temporaire
- Logs complets côté serveur pour debugging 