import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Configuration Firebase
// Les valeurs sont chargées depuis les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Vérifier que toutes les variables d'environnement sont définies
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.storageBucket) {
  console.warn('⚠️ Configuration Firebase incomplète. Vérifiez vos variables d\'environnement.');
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firebase Storage
export const storage = getStorage(app);

export default app;
