# Ludora Admin Dashboard — Contexte Projet

## 🎯 Vue d'ensemble

Ce document décrit le contexte et les spécifications du **dashboard d'administration** de **Ludora**, une plateforme de matchmaking sportif. Ce back-office est destiné exclusivement aux administrateurs internes.

> [!NOTE]
> Pour une vision détaillée de l'organisation des dossiers et des principes techniques du projet, se référer au document [ARCHITECTURE.md](./context/ARCHITECTURE.md).
> Pour les directives de design et le système de composants, consulter [DESIGN.md](./context/DESIGN.md).

---

## 🏗️ Stack Technique

| Outil | Rôle |
|---|---|
| **Next.js** (App Router) | Framework React full-stack, routing, SSR/SSG |
| **Tailwind CSS** | Styling utilitaire |
| **Orval** | Génération automatique des hooks React Query + types TypeScript à partir du schéma OpenAPI du backend |
| **React Query** (TanStack Query) | Fetching, caching, mutations et synchronisation des données serveur |

> Les appels API sont tous générés via Orval depuis le contrat OpenAPI. Ne jamais appeler `fetch` directement : utiliser les hooks générés.

---

## 📱 Contexte Applicatif — Ludora

Ludora est une plateforme B2C de mise en relation de joueurs pour organiser et rejoindre des sessions sportives sur des terrains référencés.

### Entités principales

- **Users** : joueurs inscrits (email/password ou Google SSO)
- **Sessions** : rencontres sportives créées par les users (publiques ou privées)
- **Terrains** : lieux de jeu référencés, avec photos, horaires et vérification
- **Friendships** : réseau social entre joueurs
- **Messages** : messagerie temps réel (privée, groupe, session)
- **Ratings** : système de notation fair-play (5 critères)
- **Notifications** : push mobile + centre de notifications
- **Reports** : signalements effectués par les users

---

## 🖥️ Fonctionnalités du Dashboard Admin

### 1. 📊 Vue Globale — Statistiques

Page d'accueil du dashboard avec les métriques clés :

- **Users** : total inscrits, nouveaux ce mois, actifs (ont joué au moins 1 session), comptes désactivés/supprimés
- **Sessions** : total créées, sessions publiques vs privées, répartition par sport, sessions actives aujourd'hui
- **Terrains** : total référencés, en attente de validation, validés, par type de surface
- **Signalements** : nombre total, non traités, traités ce mois

Graphiques suggérés : inscriptions sur 30 jours, sessions par sport (pie/bar), activité hebdomadaire.

---

### 2. 👥 Administration des Utilisateurs

Liste paginée et filtrable de tous les utilisateurs.

**Colonnes affichées :**
- Avatar, Nom, Email
- Date d'inscription
- Statut (`actif` / `inactif` / `désactivé` / `supprimé`)
- Méthode d'auth (`email` / `google`)
- Nombre de sessions jouées
- Score fair-play moyen

**Actions disponibles :**
- Voir le profil complet (sports, disponibilités, historique de sessions, amis, évaluations reçues)
- Désactiver / réactiver un compte
- Supprimer définitivement un compte
- Recherche par nom ou email
- Filtres : statut, méthode d'auth, sport pratiqué, date d'inscription

---

### 3. 🏟️ Administration des Terrains

Gestion des terrains soumis par les utilisateurs ou créés par les admins.

**Liste avec colonnes :**
- Nom du terrain, adresse, ville
- Type de surface (gazon, béton, parquet…)
- Sports praticables
- Statut (`en attente` / `vérifié` / `rejeté`)
- Soumis par (user ou admin)
- Date de soumission

**Actions :**
- Valider ou rejeter un terrain soumis par un user
- Modifier les informations d'un terrain (nom, adresse, surface, sports)
- Gérer les photos : voir la galerie, supprimer des photos inappropriées, ajouter des photos
- Gérer les créneaux de disponibilité (slots)
- Supprimer un terrain

**File d'attente de validation :** Vue dédiée aux terrains en statut `en attente`, pour accélérer le traitement.

---

### 4. 🚨 Signalements

Centre de traitement des signalements effectués par les utilisateurs.

**Informations affichées :**
- Auteur du signalement
- Cible (user, session, terrain, message)
- Type / motif du signalement
- Date
- Statut (`non traité` / `en cours` / `résolu` / `ignoré`)

**Actions :**
- Voir le détail (lien vers l'entité signalée)
- Changer le statut
- Ajouter une note interne
- Filtrer par type de cible, statut, date

---

## 🧭 Structure de Navigation Suggérée

```
/admin
├── /dashboard          ← Statistiques globales (page d'accueil)
├── /users              ← Liste des utilisateurs
│   └── /[id]           ← Détail d'un utilisateur
├── /terrains           ← Liste de tous les terrains
│   ├── /pending        ← File d'attente de validation
│   └── /[id]           ← Détail / édition d'un terrain
├── /sessions           ← Liste des sessions (lecture seule + stats)
└── /reports            ← Signalements
```

---

## 🔐 Accès & Sécurité

- Le dashboard est accessible uniquement aux utilisateurs avec le rôle `admin`
- Protéger toutes les routes via middleware Next.js
- Les actions destructives (suppression de compte, rejet de terrain) doivent afficher une confirmation
- Logger les actions admin sensibles (audit trail)

---

## 🧱 Conventions de Code

- Utiliser les **hooks générés par Orval** pour tous les appels API (ne pas écrire de `fetch` manuellement)
- Utiliser **React Query** pour les mutations avec invalidation de cache explicite après chaque action
- Composants en **TypeScript strict**
- Nommage : `PascalCase` pour les composants, `camelCase` pour les fonctions et variables
- Un composant = un fichier, co-localisé avec ses types si nécessaire
- Les pages admin vivent dans `app/admin/`

---

## 📦 Librairies UI recommandées

- **shadcn/ui** ou **Radix UI** pour les composants accessibles (modales, dropdowns, toasts)
- **Recharts** ou **Chart.js** pour les graphiques du dashboard
- **react-table** (TanStack Table) pour les tableaux paginés et filtrables
- **react-dropzone** pour l'upload de photos de terrains