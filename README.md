# 🏟️ Ludora Admin Dashboard

Bienvenue sur le dashboard d'administration de **Ludora**, la plateforme B2C de matchmaking sportif. Ce back-office est destiné exclusivement aux administrateurs internes pour la gestion des utilisateurs, des terrains et des signalements.

---

## 🛠️ Stack Technique

Le projet utilise les technologies suivantes :

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestion d'état serveur** : [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Génération d'API** : [Orval](https://orval.dev/) pour générer automatiquement les hooks React Query et les types TypeScript à partir du schéma OpenAPI du backend
- **UI** : [Base UI](https://base-ui.com/), [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Qualité de code** : [Biome](https://biomejs.dev/) pour le linting et le formatage

---

## 📂 Architecture du Projet

Le projet suit une approche modulaire **Feature-First** (les fichiers sont regroupés par domaine fonctionnel plutôt que par type technique). L'essentiel de la logique réside dans `src/` :

- `src/app/` : Routes et pages de l'application (Next.js App Router). Les pages admin vivent sous `src/app/admin/`.
- `src/features/` : Le cœur métier de l'application. Chaque sous-dossier correspond à une fonctionnalité (ex: `users`, `terrains`, `reports`, `dashboard`) contenant ses propres composants, hooks et types locaux.
- `src/components/` : Composants transverses et réutilisables, séparés en :
  - `ui/` : Composants atomiques (boutons, inputs, dialogues).
  - `layout/` : Composants structurels.
- `src/api/` : Clients et hooks d'API générés automatiquement par Orval.
- `src/providers/` : Fournisseurs de contextes globaux (ex: QueryClientProvider).

Pour en savoir plus sur l'architecture, consultez le document [ARCHITECTURE.md](file:///Users/ganaf4ll/Documents/code/MDS/LUDORA/ludora-admin-dashboard/context/ARCHITECTURE.md).

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** (version recommandée: >= 20)
- **pnpm** (gestionnaire de paquets)

### Installation

1. Clonez le dépôt et installez les dépendances :
   ```bash
   pnpm install
   ```

2. Configurez les variables d'environnement. Copiez le fichier d'exemple et configurez-le :
   ```bash
   cp .env.example .env
   ```

### Lancement du serveur de développement

Pour démarrer l'application localement avec rechargement automatique :

```bash
pnpm dev
```

L'application est accessible à l'adresse [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Commandes Utiles

| Commande | Rôle |
| :--- | :--- |
| `pnpm dev` | Lance le serveur de développement Next.js |
| `pnpm build` | Regénère le client API et compile le projet pour la production |
| `pnpm start` | Démarre l'application Next.js en production après le build |
| `pnpm lint` | Analyse le projet pour trouver des erreurs de syntaxe/style avec Biome |
| `pnpm format` | Formate automatiquement tous les fichiers du projet avec Biome |
| `pnpm check` | Effectue une passe complète de linting et formatage avec correction automatique |
| `pnpm generate:api` | Télécharge le Swagger et régénère les hooks API et types Orval |

---

## 🔌 Intégration API & Orval

Tous les appels API sont typés et générés à partir du contrat OpenAPI du backend.
> [!IMPORTANT]
> **Ne jamais écrire d'appels `fetch` ou d'appels Axios manuellement.** Utilisez toujours les hooks générés par Orval disponibles dans `src/api/generated/`.

Si le contrat API du backend change, mettez à jour votre client local en lançant :

```bash
pnpm generate:api
```

---

## 🛡️ Sécurité & Rôles

- Le dashboard d'administration est sécurisé et restreint aux utilisateurs ayant le rôle `admin`.
- Toutes les routes d'administration sont protégées par le middleware Next.js.
- Toute action destructive (ex. suppression définitive d'un compte utilisateur, rejet de terrain) doit impérativement afficher une modale de confirmation.
