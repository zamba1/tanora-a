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

interface RavitaillementsResponse {
  ravitaillements: Ravitaillement[];
}

interface UseSSERavitaillementsOptions {
  /** Callback appelé quand un ravitaillement est créé */
  onRavitaillementCreated?: (ravitaillement: Ravitaillement) => void;
  /** Callback appelé quand un ravitaillement est modifié */
  onRavitaillementUpdated?: (ravitaillement: Ravitaillement) => void;
  /** Callback appelé quand un ravitaillement est supprimé */
  onRavitaillementDeleted?: (ravitaillementId: number) => void;
}

export function useSSERavitaillements(options: UseSSERavitaillementsOptions = {}) {
  const { onRavitaillementCreated, onRavitaillementUpdated, onRavitaillementDeleted } = options;
  
  const [ravitaillements, setRavitaillements] = useState<Ravitaillement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const callbacksRef = useRef({ onRavitaillementCreated, onRavitaillementUpdated, onRavitaillementDeleted });

  // Mettre à jour les callbacks
  useEffect(() => {
    callbacksRef.current = { onRavitaillementCreated, onRavitaillementUpdated, onRavitaillementDeleted };
  });

  // Charger les données initiales
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ravitaillements');
      
      if (!response.ok) {
        throw new Error('Failed to fetch ravitaillements');
      }
      
      const data: RavitaillementsResponse = await response.json();
      setRavitaillements(data.ravitaillements);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching ravitaillements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialiser la connexion SSE
  useEffect(() => {
    // Ne se connecter en SSE que sur Vercel
    if (typeof window !== 'undefined' && !window.location.hostname.includes('vercel.app')) {
      console.log('⚠️ SSE non nécessaire en développement, utilisation du hook WebSocket');
      setIsConnected(false);
      setLoading(false);
      return;
    }

    fetchInitialData();

    // Créer la connexion SSE
    eventSourceRef.current = new EventSource('/api/ravitaillements/events');

    eventSourceRef.current.onopen = () => {
      console.log('✅ SSE connecté');
      setIsConnected(true);
      setError(null);
    };

    eventSourceRef.current.onerror = (er) => {
      console.error('❌ Erreur SSE:', er);
      setIsConnected(false);
      setError('Erreur de connexion temps réel');
    };

    eventSourceRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'connected':
            console.log('📡 SSE connecté à', message.timestamp);
            break;
            
          case 'ravitaillement:created':
            console.log('📡 Nouveau ravitaillement reçu via SSE:', message.data);
            setRavitaillements(prev => [message.data, ...prev]);
            setLastUpdated(new Date());
            if (callbacksRef.current.onRavitaillementCreated) {
              callbacksRef.current.onRavitaillementCreated(message.data);
            }
            break;
            
          case 'ravitaillement:updated':
            console.log('📡 Ravitaillement modifié reçu via SSE:', message.data);
            setRavitaillements(prev => 
              prev.map(r => r.id === message.data.id ? message.data : r)
            );
            setLastUpdated(new Date());
            if (callbacksRef.current.onRavitaillementUpdated) {
              callbacksRef.current.onRavitaillementUpdated(message.data);
            }
            break;
            
          case 'ravitaillement:deleted':
            console.log('📡 Ravitaillement supprimé reçu via SSE:', message.data.id);
            setRavitaillements(prev => prev.filter(r => r.id !== message.data.id));
            setLastUpdated(new Date());
            if (callbacksRef.current.onRavitaillementDeleted) {
              callbacksRef.current.onRavitaillementDeleted(message.data.id);
            }
            break;
            
          default:
            console.log('📡 Message SSE non géré:', message);
        }
        } catch (er) {
          console.error('Erreur parsing message SSE:', er);
        }
    };

    // Cleanup
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [fetchInitialData]);

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
      return newRavitaillement;
    } catch (err) {
      console.error('Error creating ravitaillement:', err);
      throw err;
    }
  }, []);

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
      return updatedRavitaillement;
    } catch (err) {
      console.error('Error updating ravitaillement:', err);
      throw err;
    }
  }, []);

  const deleteRavitaillement = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/ravitaillements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete ravitaillement');
      }

      return true;
    } catch (err) {
      console.error('Error deleting ravitaillement:', err);
      throw err;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
