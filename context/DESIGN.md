# Ludora Admin Dashboard — Design System

## 🎨 Style : Soft UI

Le Soft UI repose sur trois principes visuels fondamentaux :

- **Surfaces douces** — Les cards et composants ont une légère élévation grâce à des ombres colorées (jamais grises ou noires pures). Pas de bordures agressives : tout flotte légèrement au-dessus du fond.
- **Profondeur colorée** — Les ombres sont teintées avec les couleurs de la palette. Une card sur fond clair porte une ombre turquoise ou violette subtile. C'est ce qui donne une identité visuelle immédiatement reconnaissable.
- **Hiérarchie par matière** — La distinction entre un élément actif, hover ou désactivé se fait par la profondeur de l'ombre et la saturation, pas uniquement par la couleur.

---

## 🎨 Palette de Couleurs

### Couleurs primaires (charte Ludora)

| Nom | Hex | Usage principal |
|---|---|---|
| Turquoise Clair | `#97CDCC` | Backgrounds, surfaces neutres, illustrations |
| Turquoise Moyen | `#6AAFAD` | Sidebar, graphiques secondaires, éléments de support |
| Violet Principal | `#864C9E` | Accent, icônes actives, CTA secondaires |
| Violet Profond | `#652F8F` | CTA primaires, badges, éléments d'action |
| Violet Nuit | `#3C215A` | Navigation principale, textes forts, headers |

### Backgrounds & surfaces

| Rôle | Hex | Description |
|---|---|---|
| Fond de page | `#F2F8F8` | Turquoise très désaturé, fond général de l'app |
| Surface card | `#FFFFFF` | Blanc pur pour cards, modales, panels |
| Surface secondaire | `#EAF4F4` | Cards de lecture, zones neutres |
| Sidebar | `#3C215A` | Navigation latérale (Violet Nuit direct) |

### Textes

| Rôle | Hex | Description |
|---|---|---|
| Primaire | `#1A1025` | Titres, valeurs importantes |
| Secondaire | `#5A4D6B` | Corps de texte, descriptions |
| Discret | `#9B90A8` | Placeholders, métadonnées, hints |
| Sur fond sombre | `#FFFFFF` | Texte sur sidebar et surfaces violettes |
| Accent | `#652F8F` | Liens, valeurs mises en avant |

### États sémantiques

| État | Hex fond | Hex texte | Usage |
|---|---|---|---|
| Succès | `#E8F5EE` | `#1E6B42` | Terrain validé, action confirmée |
| Attention | `#FEF4E4` | `#7A5010` | En attente de validation, signalement ouvert |
| Erreur | `#FDECEC` | `#7A2020` | Terrain rejeté, compte suspendu |
| Info | `#EEF0FD` | `#2D3A8C` | Notifications neutres, tips admin |

### Dark Mode

Le dark mode approfondit la palette plutôt que de l'inverser. Les violets deviennent des fonds riches, les turquoises deviennent des accents lumineux.

| Rôle | Light | Dark |
|---|---|---|
| Fond de page | `#F2F8F8` | `#0F0A18` |
| Surface card | `#FFFFFF` | `#1C1228` |
| Texte primaire | `#1A1025` | `#EDE8F5` |
| Texte secondaire | `#5A4D6B` | `#A898C0` |

---

## 🔠 Typographie

| Rôle | Police | Taille | Graisse | Usage |
|---|---|---|---|---|
| Page title | `DM Sans` | `24px` | `700` | Titre de section (ex: "Utilisateurs") |
| Section header | `DM Sans` | `18px` | `600` | Sous-titres de blocs |
| KPI value | `DM Sans` | `32px` | `800` | Valeurs métriques (ex: "1 248") |
| Body | `DM Sans` | `14px` | `400` | Contenu général, descriptions |
| Label / Meta | `DM Sans` | `12px` | `400` | Dates, statuts, placeholders |
| Code / ID | `JetBrains Mono` | `13px` | `400` | UUIDs, tokens, valeurs techniques |

> **Import Google Fonts** : `DM Sans` (400, 600, 700, 800) + `JetBrains Mono` (400)

---

## 📐 Espacements & Layout

Le dashboard utilise une grille basée sur des multiples de `4px`.

| Token | Valeur | Usage |
|---|---|---|
| `spacing-1` | `4px` | Gap minimal, padding interne icône |
| `spacing-2` | `8px` | Padding tag/badge |
| `spacing-3` | `12px` | Gap entre éléments inline |
| `spacing-4` | `16px` | Padding card compact |
| `spacing-6` | `24px` | Padding card standard |
| `spacing-8` | `32px` | Gap entre sections |
| `spacing-12` | `48px` | Marges de page |

**Layout général :**
- Sidebar fixe : `260px` de large
- Zone de contenu : `calc(100vw - 260px)`
- Padding de page : `32px`
- Gap entre cards de la grille : `24px`

---

## 🧩 Composants

### Cards

```css
background: #FFFFFF;
border-radius: 16px;
padding: 24px;
box-shadow: 4px 4px 16px rgba(106, 175, 173, 0.15),
            -2px -2px 8px rgba(255, 255, 255, 0.8);
```

**Hover :**
```css
transform: translateY(-2px);
box-shadow: 6px 6px 24px rgba(101, 47, 143, 0.18),
            -2px -2px 8px rgba(255, 255, 255, 0.9);
transition: all 0.2s ease;
```

> Pas de `border` visible. L'élévation seule définit les contours.

---

### Metric Cards (KPIs)

Structure d'une card de statistique :

```
┌─────────────────────────────┐
│  [Icône]        [+12% ↑]   │  ← icône dans container arrondi violet clair
│                              │     + variation en badge succès/erreur
│  1 248                       │  ← valeur en 32px/800
│  Utilisateurs actifs         │  ← label en 12px/400 discret
└─────────────────────────────┘
```

- Container icône : `width: 44px; height: 44px; border-radius: 12px; background: rgba(134, 76, 158, 0.1)`
- Icône : couleur `#864C9E`, taille `20px`
- Badge variation positive : fond `#E8F5EE`, texte `#1E6B42`
- Badge variation négative : fond `#FDECEC`, texte `#7A2020`

---

### Boutons

**Primaire :**
```css
background: linear-gradient(135deg, #652F8F, #864C9E);
color: #FFFFFF;
border-radius: 10px;
padding: 10px 20px;
font-weight: 600;
font-size: 14px;
box-shadow: 0 4px 14px rgba(101, 47, 143, 0.35);
border: none;
```

Hover : `box-shadow: 0 6px 20px rgba(101, 47, 143, 0.5); transform: translateY(-1px);`

**Secondaire :**
```css
background: #FFFFFF;
color: #652F8F;
border: 1.5px solid #864C9E;
border-radius: 10px;
padding: 10px 20px;
font-weight: 600;
box-shadow: 2px 2px 8px rgba(106, 175, 173, 0.15);
```

**Destructif (danger) :**
```css
background: linear-gradient(135deg, #7A2020, #B03030);
color: #FFFFFF;
box-shadow: 0 4px 14px rgba(122, 32, 32, 0.3);
```

**Désactivé :**
```css
opacity: 0.45;
cursor: not-allowed;
box-shadow: none;
transform: none;
```

---

### Navigation — Sidebar

```css
/* Conteneur */
background: #3C215A;
width: 260px;
height: 100vh;
padding: 24px 16px;
```

```css
/* Item de navigation au repos */
color: rgba(255, 255, 255, 0.6);
border-radius: 10px;
padding: 10px 14px;
font-size: 14px;
font-weight: 500;
```

```css
/* Item actif */
background: rgba(134, 76, 158, 0.35);
color: #FFFFFF;
border-left: 3px solid #97CDCC;
font-weight: 600;
```

Hover (inactif) :
```css
background: rgba(255, 255, 255, 0.08);
color: rgba(255, 255, 255, 0.85);
```

**Logo** : en haut de sidebar, texte blanc. Séparateur `rgba(255,255,255,0.1)` entre logo et nav items.

**Section labels** (ex: "Gestion", "Monitoring") : `font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: rgba(255,255,255,0.35); text-transform: uppercase;`

---

### Inputs & Champs de formulaire

```css
background: #FFFFFF;
border: 1.5px solid #D0E8E8;
border-radius: 10px;
padding: 10px 14px;
font-size: 14px;
color: #1A1025;
box-shadow: inset 2px 2px 6px rgba(106, 175, 173, 0.08);
```

**Focus :**
```css
border-color: #864C9E;
box-shadow: 0 0 0 3px rgba(134, 76, 158, 0.12),
            inset 2px 2px 6px rgba(106, 175, 173, 0.08);
outline: none;
```

**Placeholder :** couleur `#9B90A8`

**Select / Dropdown :** même style que l'input. La liste déroulante est une card blanche avec `border-radius: 12px` et ombre turquoise.

---

### Tableaux (listes paginées)

```css
/* Table container */
background: #FFFFFF;
border-radius: 16px;
overflow: hidden;
box-shadow: 4px 4px 16px rgba(106, 175, 173, 0.12);
```

```css
/* Header de colonne */
background: #F2F8F8;
color: #5A4D6B;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.06em;
padding: 12px 16px;
```

```css
/* Ligne */
border-bottom: 1px solid #EAF4F4;
padding: 14px 16px;
color: #1A1025;
font-size: 14px;
```

Hover ligne : `background: #F7FBFB`

---

### Badges & Statuts

Forme : `border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 600;`

| Statut | Fond | Texte |
|---|---|---|
| `vérifié` / `actif` | `#E8F5EE` | `#1E6B42` |
| `en attente` | `#FEF4E4` | `#7A5010` |
| `rejeté` / `désactivé` | `#FDECEC` | `#7A2020` |
| `info` / neutre | `#EEF0FD` | `#2D3A8C` |
| `supprimé` | `#F0EBF5` | `#652F8F` |

---

### Modales de confirmation

```css
/* Overlay */
background: rgba(60, 33, 90, 0.4);
backdrop-filter: blur(4px);

/* Modal */
background: #FFFFFF;
border-radius: 20px;
padding: 32px;
box-shadow: 8px 8px 40px rgba(101, 47, 143, 0.2);
max-width: 480px;
```

Structure :
- Icône d'alerte en haut (container arrondi rouge clair pour destructif, violet pour neutre)
- Titre en `18px/600`
- Description en `14px/400` couleur secondaire
- 2 boutons : annuler (secondaire) + confirmer (primaire ou destructif)

---

### Notifications Toast

Apparaissent en bas à droite, avec `border-radius: 12px` et ombre colorée.

```css
background: #FFFFFF;
border-left: 4px solid [couleur selon type];
box-shadow: 4px 4px 20px rgba(101, 47, 143, 0.15);
padding: 14px 18px;
```

Couleur de la bordure gauche : succès → `#1E6B42`, erreur → `#7A2020`, info → `#2D3A8C`, attention → `#7A5010`

---

## 🎞️ Animations & Transitions

| Élément | Transition | Durée |
|---|---|---|
| Cards hover | `transform`, `box-shadow` | `200ms ease` |
| Boutons hover | `transform`, `box-shadow`, `filter` | `150ms ease` |
| Sidebar items | `background`, `color` | `150ms ease` |
| Inputs focus | `border-color`, `box-shadow` | `150ms ease` |
| Modales | `opacity`, `scale` (0.95 → 1) | `200ms ease-out` |
| Toasts | `translateX` (slide depuis droite) | `250ms ease-out` |
| Tableaux (ligne) | `background` | `100ms ease` |

> **Règle** : pas d'animation sur les éléments de données (cellules de tableau, valeurs KPI). Uniquement sur les contenants et les éléments interactifs.

---

## 📦 Tokens CSS (Tailwind custom config)

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      turquoise: {
        light: '#97CDCC',
        DEFAULT: '#6AAFAD',
      },
      violet: {
        principal: '#864C9E',
        deep: '#652F8F',
        night: '#3C215A',
      },
      surface: {
        page: '#F2F8F8',
        card: '#FFFFFF',
        secondary: '#EAF4F4',
      },
      text: {
        primary: '#1A1025',
        secondary: '#5A4D6B',
        muted: '#9B90A8',
        accent: '#652F8F',
      },
    },
    borderRadius: {
      card: '16px',
      btn: '10px',
      badge: '6px',
      modal: '20px',
    },
    boxShadow: {
      card: '4px 4px 16px rgba(106,175,173,0.15), -2px -2px 8px rgba(255,255,255,0.8)',
      'card-hover': '6px 6px 24px rgba(101,47,143,0.18), -2px -2px 8px rgba(255,255,255,0.9)',
      btn: '0 4px 14px rgba(101,47,143,0.35)',
      'btn-hover': '0 6px 20px rgba(101,47,143,0.5)',
      input: 'inset 2px 2px 6px rgba(106,175,173,0.08)',
      'input-focus': '0 0 0 3px rgba(134,76,158,0.12)',
    },
  },
}
```

---

## ✅ Checklist Design

Avant de livrer un composant ou une page :

- [ ] Les ombres sont teintées (pas de gris pur ni de `rgba(0,0,0,...)`)
- [ ] Le `border-radius` respecte la hiérarchie (cards 16px, boutons 10px, badges 6px)
- [ ] Les états hover et focus sont définis
- [ ] Les états sémantiques utilisent les bonnes couleurs de fond + texte
- [ ] Aucun `border` visible sur les cards (élévation seule)
- [ ] Les transitions sont fluides et inférieures à 300ms
- [ ] Le contraste texte/fond est suffisant (ratio WCAG AA minimum)
- [ ] Le composant est cohérent en dark mode si applicable