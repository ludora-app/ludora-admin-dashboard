# Architecture du Projet Ludora Website

Ce document détaille l'architecture technique et l'organisation du code du projet Ludora Website. Le projet est construit avec **Next.js 16 (App Router)** et suit une approche modulaire orientée "Features".

## 🚀 Principes Directeurs

- **Modularité (Feature-First)** : Le code est organisé par fonctionnalités plutôt que par types de fichiers techniques.
- **Typescript First** : Utilisation stricte de TypeScript pour la sécurité et l'auto-complétion.
- **Performance** : Utilisation de Next.js Turbopack pour un développement ultra-rapide et optimisation du rendu côté serveur.
- **Esthétique Premium** : Utilisation de Tailwind CSS 4 et Radix UI pour des interfaces fluides et modernes.

## 📂 Structure du dossier `src`

L'essentiel de la logique se trouve dans le dossier `src`. Voici le détail des sous-répertoires :

### 🔹 `app`
Contient les routes de l'application (pages, layouts, loading, errors). C'est le point d'entrée de Next.js App Router.

### 🔹 `features`
C'est le cœur de l'architecture. Chaque dossier dans `features` représente une fonctionnalité ou une page majeure (ex: `home`, `about`, `contact`).
- Une feature regroupe ses propres composants locaux, hooks, types et logique métier.
- Elle expose généralement un composant principal (ex: `HomeScreen`) via `features/index.ts`.

### 🔹 `components`
Composants partagés à travers toute l'application. Divisés en :
- `ui` : Composants atomiques réutilisables (boutons, inputs, etc.) souvent basés sur Radix UI.
- `layout` : Éléments de structure (conteneurs, sections).
- `chill-ui` : Bibliothèque interne de composants stylisés.

### 🔹 `api`
Logique liée aux appels API externes et hooks de requêtage (TanStack Query).
- `queries` : Définition des hooks de récupération de données.
- `utils` : Utilitaires pour la gestion des requêtes.

### 🔹 `services`
Services transverses (ex: `PostHog` pour l'analytics) qui encapsulent la logique de bibliothèques tierces.

### 🔹 `lib`
Configurations et initialisations de bibliothèques externes.

### 🔹 `hooks`
Hooks React personnalisés et réutilisables globalement (ex: `useMediaQuery`).

### 🔹 `constants`
Valeurs constantes globales, énumérations et configurations statiques.

### 🔹 `providers`
Composants de contexte React enveloppant l'application (ex: QueryClientProvider, TolgeeProvider).

### 🔹 `tolgee`
Configuration de l'internationalisation (i18n) avec Tolgee.

### 📄 Fichiers à la racine de `src`
- `instrumentation.ts` : Utilisé par Next.js pour l'observabilité et l'initialisation de services (ex: monitoring).
- `proxy.ts` : Logique de proxy pour les requêtes API si nécessaire.
