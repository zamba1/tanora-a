# Application Mobile - Publications et Ravitaillements

## Description
Application mobile responsive pour gérer des publications et des points de ravitaillement.

## Structure de l'application

### Modèles de données (Prisma)
- **Publication** : description, image, dates de création/modification
- **Ravitaillement** : nom du groupe, latitude, longitude, adresse, dates

### Pages principales
1. **Page d'accueil** (`/`) : Navigation vers les deux sections principales
2. **Publications** (`/publications`) : Liste avec infinite scroll des publications
3. **Ravitaillements** (`/ravitaillements`) : Carte interactive avec Leaflet

### APIs
- `GET /api/publications` : Liste paginée des publications
- `GET /api/ravitaillements` : Liste de tous les points de ravitaillement

## Fonctionnalités

### Page Publications
- Défilement infini (infinite scroll)
- Affichage des images si disponibles
- Interface mobile-friendly
- Pagination automatique

### Page Ravitaillements
- Carte interactive avec Leaflet
- Marqueurs pour chaque point de ravitaillement
- Popups avec informations détaillées
- Centrée sur Madagascar par défaut

## Technologies utilisées
- Next.js 15
- React 18
- Material-UI (MUI)
- Prisma (ORM)
- PostgreSQL
- Leaflet (cartes)
- TypeScript

## Installation et configuration

1. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

2. Configurer la base de données :
```bash
npx prisma generate
npx prisma db push
```

3. Démarrer l'application :
```bash
npm run dev
# ou
yarn dev
```

## Structure des fichiers

```
src/
├── app/
│   ├── api/
│   │   ├── publications/route.ts
│   │   └── ravitaillements/route.ts
│   ├── publications/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── ravitaillements/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── prisma.ts
└── global.css
```

## Configuration de la base de données

L'application utilise PostgreSQL avec Prisma. Assurez-vous de configurer la variable d'environnement `DATABASE_URL` dans votre fichier `.env`.

## Responsive Design

L'application est optimisée pour les appareils mobiles avec :
- Interface adaptative
- Navigation tactile
- Cartes interactives
- Défilement fluide
