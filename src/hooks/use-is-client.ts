import { useState, useEffect } from 'react';

/**
 * Hook pour détecter si on est côté client
 * Utile pour éviter les erreurs d'hydratation
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
