/* eslint-disable consistent-return */
import { useRef, useState, useEffect, useCallback } from 'react';

interface Ravitaillement {
  id: number;
  nomGroup: string;
  latitude: number;
  longitude: number;
  adresse: string;
  createdAt: string;
  updatedAt: string;
}

interface UseVercelFallbackRavitaillementsOptions {
  /** Callback appelé quand un ravitaillement est créé */
  onRavitaillementCreated?: (ravitaillement: Ravitaillement) => void;
  /** Callback appelé quand un ravitaillement est modifié */
  onRavitaillementUpdated?: (ravitaillement: Ravitaillement) => void;
  /** Callback appelé quand un ravitaillement est supprimé */
  onRavitaillementDeleted?: (ravitaillementId: number) => void;
}

export function useVercelFallbackRavitaillements(options: UseVercelFallbackRavitaillementsOptions = {}) {
  const { 
    onRavitaillementCreated, 
    onRavitaillementUpdated, 
    onRavitaillementDeleted
  } = options;
  
  const [ravitaillements, setRavitaillements] = useState<Ravitaillement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const callbacksRef = useRef({ onRavitaillementCreated, onRavitaillementUpdated, onRavitaillementDeleted });

  // Mettre à jour les callbacks
  useEffect(() => {
    callbacksRef.current = { onRavitaillementCreated, onRavitaillementUpdated, onRavitaillementDeleted };
  });

  // Charger les données
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ravitaillements', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch ravitaillements');
      }
      
      const data = await response.json();
      const newRavitaillements = data.ravitaillements || [];
      
      setRavitaillements(newRavitaillements);
      setLastUpdated(new Date());
      setError(null);
      setIsConnected(true);
      
    } catch (err) {
      console.error('Erreur lors du fetch:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données initiales
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hostname.includes('vercel.app')) {
      console.log('⚠️ Fallback Vercel non nécessaire en développement');
      setIsConnected(false);
      setLoading(false);
      return;
    }

    fetchData();
  }, [fetchData]);

  // Refresh simple sans loader
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/ravitaillements', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch ravitaillements');
      }
      
      const data = await response.json();
      const newRavitaillements = data.ravitaillements || [];
      
      setRavitaillements(newRavitaillements);
      setLastUpdated(new Date());
      setError(null);
      setIsConnected(true);
      
    } catch (err) {
      console.error('Erreur lors du refresh:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsConnected(false);
    }
  }, []);

  // Fonctions pour manipuler les ravitaillements
  const createRavitaillement = useCallback(async (data: {
    nomGroup: string;
    latitude: number;
    longitude: number;
    adresse: string;
  }) => {
    try {
      const response = await fetch('/api/ravitaillements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ravitaillement');
      }

      const newRavitaillement = await response.json();
      
      // Appeler le callback si fourni
      if (callbacksRef.current.onRavitaillementCreated) {
        callbacksRef.current.onRavitaillementCreated(newRavitaillement);
      }
      
      // Rafraîchir les données automatiquement (sans loader)
      refresh();
      
      return newRavitaillement;
    } catch (err) {
      console.error('Error creating ravitaillement:', err);
      throw err;
    }
  }, [refresh]);

  const updateRavitaillement = useCallback(async (id: number, data: {
    nomGroup: string;
    latitude: number;
    longitude: number;
    adresse: string;
  }) => {
    try {
      const response = await fetch(`/api/ravitaillements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ravitaillement');
      }

      const updatedRavitaillement = await response.json();
      
      // Appeler le callback si fourni
      if (callbacksRef.current.onRavitaillementUpdated) {
        callbacksRef.current.onRavitaillementUpdated(updatedRavitaillement);
      }
      
      // Rafraîchir les données automatiquement (sans loader)
      refresh();
      
      return updatedRavitaillement;
    } catch (err) {
      console.error('Error updating ravitaillement:', err);
      throw err;
    }
  }, [refresh]);

  const deleteRavitaillement = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/ravitaillements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete ravitaillement');
      }

      // Appeler le callback si fourni
      if (callbacksRef.current.onRavitaillementDeleted) {
        callbacksRef.current.onRavitaillementDeleted(id);
      }

      // Rafraîchir les données automatiquement (sans loader)
      refresh();

      return true;
    } catch (err) {
      console.error('Error deleting ravitaillement:', err);
      throw err;
    }
  }, [refresh]);


  return {
    ravitaillements,
    loading,
    error,
    isConnected,
    lastUpdated,
    createRavitaillement,
    updateRavitaillement,
    deleteRavitaillement,
    refresh,
  };
}
