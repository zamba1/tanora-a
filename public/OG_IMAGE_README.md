# Image Open Graph (og-image.jpg)

Pour que l'aperçu lors du partage du lien soit optimal, vous devez ajouter une image dans le dossier `public/`.

## Spécifications recommandées

- **Nom du fichier** : `og-image.jpg` (ou `.png`, `.webp`)
- **Dimensions** : 1200 x 630 pixels (ratio 1.91:1)
- **Taille** : Moins de 1 MB de préférence
- **Format** : JPG, PNG ou WebP

## Suggestions d'images

L'image devrait représenter :
- Un assortiment de chips de légumes colorées (betterave, carotte, patate douce, courgette, etc.)
- Une ou plusieurs briques/cartons de soupes de légumes
- Une ambiance fraîche, naturelle et moderne (table en bois clair, fond vert, etc.)

## Où placer l'image

Placez l'image directement dans le dossier `public/` :
```
public/og-image.jpg
```

## Alternative : URL externe

Si vous préférez utiliser une URL externe, modifiez le fichier `src/app/layout.tsx` et remplacez :
```typescript
url: `${siteUrl}/og-image.jpg`,
```
par votre URL d'image.

## Test

Pour tester l'aperçu, utilisez :
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
