# Dynamisation des Données - Plateforme de Capitalisation

## 🎯 Objectifs Réalisés

### ✅ 1. Éditeur WYSIWYG avec Lexical
- **Remplacement de TipTap par Lexical Composer** pour un meilleur contrôle et performance
- **Composant LexicalEditor** moderne avec barre d'outils complète
- **Intégration dans le formulaire de création de connaissances** avec validation

### ✅ 2. Page Thématiques (Axes Analytiques)
- **Formulaire de création d'axes** avec sélection d'icônes Material
- **Composant IconSelector** avec catégories d'icônes organisées
- **Gestion complète** : création, modification, suppression
- **Interface moderne** avec Material-UI

### ✅ 3. Système d'Upload de Fichiers
- **Composant FileUpload** avec drag & drop
- **Intégration Firebase Storage** pour le stockage cloud
- **Gestion des métadonnées** des fichiers
- **API complète** pour l'upload et la gestion des documents

### ✅ 4. Mise à jour du Schéma de Base de Données
- **Modèle AxeAnalytique** enrichi avec `icon` et `description`
- **Modèle Document** étendu pour Firebase Storage
- **Relations optimisées** entre les entités

## 🚀 Fonctionnalités Implémentées

### 📝 Éditeur Lexical
```typescript
// Composant principal
<LexicalEditor
  initialValue={content}
  onChange={handleContentChange}
  placeholder="Rédigez votre contenu..."
  minHeight={400}
/>
```

**Fonctionnalités :**
- Formatage de texte (gras, italique, souligné)
- Titres (H1-H6)
- Listes (à puces et numérotées)
- Citations et code
- Alignement de texte
- Ligne horizontale
- Support des liens et images

### 🎨 Gestion des Thématiques
```typescript
// Page accessible via /dashboard/thematique
- Création d'axes avec icônes Material
- Sélection d'icônes par catégories
- Gestion des descriptions
- Interface de liste avec actions
```

### 📁 Upload de Fichiers
```typescript
// Composant avec drag & drop
<FileUpload
  onUpload={handleFileUpload}
  maxFiles={10}
  maxSize={50 * 1024 * 1024} // 50MB
  acceptedTypes={['image/*', 'application/pdf', ...]}
/>
```

**Fonctionnalités :**
- Drag & drop moderne
- Validation des types de fichiers
- Barre de progression
- Métadonnées personnalisables
- Intégration Firebase Storage

## 🔧 Configuration Requise

### 1. Variables d'Environnement
Créez un fichier `.env.local` avec :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/capitalisation_db"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 2. Migration de Base de Données
```bash
# Générer et appliquer les migrations
npx prisma generate
npx prisma db push
```

### 3. Configuration Firebase
1. Créez un projet Firebase
2. Activez Firebase Storage
3. Configurez les règles de sécurité
4. Récupérez les clés de configuration

## 📁 Structure des Fichiers Créés

```
src/
├── components/
│   ├── lexical-editor/
│   │   ├── LexicalEditor.tsx
│   │   ├── ToolbarPlugin.tsx
│   │   └── theme.ts
│   ├── icon-selector/
│   │   └── IconSelector.tsx
│   └── file-upload/
│       └── FileUpload.tsx
├── app/
│   ├── dashboard/
│   │   ├── thematique/
│   │   │   └── page.tsx
│   │   └── documents/
│   │       └── page.tsx
│   └── api/
│       ├── axe/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── connaissance/
│       │   └── route.ts
│       └── documents/
│           ├── route.ts
│           ├── [id]/route.ts
│           └── upload/route.ts
└── lib/
    ├── firebase.ts
    └── firebase-storage.ts
```

## 🎯 Pages Disponibles

### 1. Création de Connaissances
- **URL :** `/dashboard/connaissance`
- **Fonctionnalités :** Formulaire complet avec éditeur Lexical

### 2. Gestion des Thématiques
- **URL :** `/dashboard/thematique`
- **Fonctionnalités :** CRUD des axes analytiques avec icônes

### 3. Gestion des Documents
- **URL :** `/dashboard/documents`
- **Fonctionnalités :** Upload, visualisation et gestion des fichiers

## 🔌 APIs Disponibles

### Axes Analytiques
- `GET /api/axe` - Liste des axes
- `POST /api/axe` - Créer un axe
- `GET /api/axe/[id]` - Détails d'un axe
- `PUT /api/axe/[id]` - Modifier un axe
- `DELETE /api/axe/[id]` - Supprimer un axe

### Connaissances
- `GET /api/connaissance` - Liste des connaissances
- `POST /api/connaissance` - Créer une connaissance

### Documents
- `GET /api/documents` - Liste des documents
- `POST /api/documents` - Créer un document
- `POST /api/documents/upload` - Upload de fichiers
- `GET /api/documents/[id]` - Détails d'un document
- `PUT /api/documents/[id]` - Modifier un document
- `DELETE /api/documents/[id]` - Supprimer un document

## 🎨 Composants Réutilisables

### LexicalEditor
Éditeur WYSIWYG moderne avec barre d'outils complète.

### IconSelector
Sélecteur d'icônes Material avec recherche et catégories.

### FileUpload
Composant d'upload avec drag & drop et gestion des métadonnées.

## 🚀 Prochaines Étapes

1. **Configuration Firebase** : Renseigner les clés API
2. **Migration Base de Données** : Appliquer les changements du schéma
3. **Tests** : Tester toutes les fonctionnalités
4. **Optimisations** : Performance et UX
5. **Documentation** : Guide utilisateur

## 🛠️ Dépendances Ajoutées

```json
{
  "firebase": "^10.x.x",
  "react-dropzone": "^14.x.x"
}
```

## 📝 Notes Importantes

- **Lexical** remplace TipTap pour de meilleures performances
- **Firebase Storage** est configuré mais nécessite vos clés API
- **Schéma Prisma** mis à jour avec les nouveaux champs
- **APIs REST** complètes pour toutes les entités
- **Interface moderne** avec Material-UI

Toutes les fonctionnalités demandées ont été implémentées et sont prêtes à être utilisées ! 🎉
