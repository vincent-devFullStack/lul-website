# MongoDB Atlas M0 Heartbeat

## Objectif
Maintenir une connexion minimale au cluster (ping) sans impacter la logique métier.

## Exécution
```bash
MONGODB_URI="mongodb+srv://..." node scripts/heartbeat.js
```

Logs optionnels (par défaut silencieux) :
```bash
HEARTBEAT_LOG=1 node scripts/heartbeat.js
```

En production, le script ne charge pas `.env.local` automatiquement.

## Cron (toutes les 2 semaines)
Le cron classique ne gère pas un vrai "toutes les 2 semaines". Options simples :

### 1) 1er et 15 du mois (≈ toutes les 2 semaines)
```cron
0 3 1,15 * * /usr/bin/node /path/to/lul-website/scripts/heartbeat.js >> /var/log/heartbeat.log 2>&1
```

### 2) Hebdomadaire (plus simple/robuste)
```cron
0 3 * * 1 /usr/bin/node /path/to/lul-website/scripts/heartbeat.js >> /var/log/heartbeat.log 2>&1
```

## Serverless (planifié)
Exemple de handler :
```js
import { runHeartbeat } from "./heartbeat.js";

export async function handler() {
  await runHeartbeat();
}
```

## Vercel Cron (Hobby)
Créer un endpoint `/api/heartbeat` et ajouter dans `vercel.json` :
```json
{
  "crons": [
    { "path": "/api/heartbeat", "schedule": "0 3 1,15 * *" }
  ]
}
```

Sécurité optionnelle : définir `HEARTBEAT_TOKEN` et appeler
`/api/heartbeat?token=...` ou envoyer l'en-tête `x-heartbeat-token`.
