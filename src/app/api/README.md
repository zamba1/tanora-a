# API Endpoints - InviteYou

## Endpoints disponibles

### 1. Health Check
**GET** `/api/health`
- Vérifie que l'API fonctionne
- Retourne le statut et l'horodatage

### 2. Invite
**GET** `/api/invite`
- Récupère les informations générales sur l'invitation

**POST** `/api/invite`
- Enregistre une réponse à l'invitation
- Body: `{ response: 'yes' | 'no', name?: string, message?: string }`

### 3. Response
**GET** `/api/invite/response`
- Récupère toutes les réponses enregistrées

**POST** `/api/invite/response`
- Enregistre une réponse détaillée
- Body: `{ response: 'yes' | 'no', name?: string, message?: string }`

## Exemples d'utilisation

### Enregistrer une réponse
```typescript
const response = await fetch('/api/invite/response', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    response: 'yes',
    name: 'Marie',
    message: 'J\'ai hâte!',
  }),
});

const data = await response.json();
```

### Vérifier le statut de l'API
```typescript
const health = await fetch('/api/health');
const data = await health.json();
```
