import type { Socket } from 'socket.io-client';

import { io } from 'socket.io-client';
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

interface UseSocketRavitaillementsOptions {
  /** Callback appelé quand un ravitaillement est créé */
  onRavitaillementCreated?: (ravitaillement: Ravitaillement) => void;
  /** Callback appelé quand un ravitaillement est modifié */
  onRavitaillementUpdated?: (ravitaillement: Ravitaillement) => void;
  /** Callback appelé quand un ravitaillement est supprimé */
  onRavitaillementDeleted?: (ravitaillementId: number) => void;
}

export function useSocketRavitaillements(options: UseSocketRavitaillementsOptions = {}) {
  const { onRavitaillementCreated, onRavitaillementUpdated, onRavitaillementDeleted } = options;
  
  const [ravitaillements, setRavitaillements] = useState<Ravitaillement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef({ onRavitaillementCreated, onRavitaillementUpdated, onRavitaillementDeleted });
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProductionRef = useRef(process.env.NODE_ENV === 'production');

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

  // Polling fallback pour la production
  const startPollingFallback = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch('/api/ravitaillements');
        if (response.ok) {
          const data: RavitaillementsResponse = await response.json();
          
          // Comparer avec les données actuelles
          const currentIds = ravitaillements.map(r => r.id);
          const newIds = data.ravitaillements.map(r => r.id);
          
          // Détecter les nouveaux éléments
          const addedItems = data.ravitaillements.filter(r => !currentIds.includes(r.id));
          addedItems.forEach(item => {
            if (callbacksRef.current.onRavitaillementCreated) {
              callbacksRef.current.onRavitaillementCreated(item);
            }
          });

          // Détecter les éléments supprimés
          const deletedIds = currentIds.filter(id => !newIds.includes(id));
          deletedIds.forEach(id => {
            if (callbacksRef.current.onRavitaillementDeleted) {
              callbacksRef.current.onRavitaillementDeleted(id);
            }
          });

          // Détecter les modifications
          data.ravitaillements.forEach(newItem => {
            const oldItem = ravitaillements.find(r => r.id === newItem.id);
            if (oldItem && oldItem.updatedAt !== newItem.updatedAt) {
              if (callbacksRef.current.onRavitaillementUpdated) {
                callbacksRef.current.onRavitaillementUpdated(newItem);
              }
            }
          });

          setRavitaillements(data.ravitaillements);
          setLastUpdated(new Date());
        }
      } catch (er) {
        console.error('Error in polling fallback:', er);
      }
    }, 5000); // Poll toutes les 5 secondes en production

    console.log('📡 Fallback polling démarré (mode production)');
  }, [ravitaillements]);

  // Initialiser la connexion Socket.io ou le polling
  useEffect(() => {
    if (isProductionRef.current) {
      // Mode production : utiliser le polling
      setIsConnected(false);
      fetchInitialData().then(() => {
        startPollingFallback();
      });
    } else {
      // Mode développement : utiliser WebSocket
      const serverUrl = 'http://localhost:8083';

      socketRef.current = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      const socket = socketRef.current;

      // Événements de connexion
      socket.on('connect', () => {
        console.log('✅ Socket connecté:', socket.id);
        setIsConnected(true);
        socket.emit('join-room', 'ravitaillements');
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket déconnecté');
        setIsConnected(false);
      });

      socket.on('connect_error', (er) => {
        console.error('❌ Erreur de connexion Socket:', er);
        setIsConnected(false);
      });

      // Événements des ravitaillements
      socket.on('ravitaillement:created', (newRavitaillement: Ravitaillement) => {
        console.log('📡 Nouveau ravitaillement reçu:', newRavitaillement);
        
        setRavitaillements(prev => [newRavitaillement, ...prev]);
        setLastUpdated(new Date());
        
        if (callbacksRef.current.onRavitaillementCreated) {
          callbacksRef.current.onRavitaillementCreated(newRavitaillement);
        }
      });

      socket.on('ravitaillement:updated', (updatedRavitaillement: Ravitaillement) => {
        console.log('📡 Ravitaillement modifié reçu:', updatedRavitaillement);
        
        setRavitaillements(prev => 
          prev.map(r => r.id === updatedRavitaillement.id ? updatedRavitaillement : r)
        );
        setLastUpdated(new Date());
        
        if (callbacksRef.current.onRavitaillementUpdated) {
          callbacksRef.current.onRavitaillementUpdated(updatedRavitaillement);
        }
      });

      socket.on('ravitaillement:deleted', ({ id }: { id: number }) => {
        console.log('📡 Ravitaillement supprimé reçu:', id);
        
        setRavitaillements(prev => prev.filter(r => r.id !== id));
        setLastUpdated(new Date());
        
        if (callbacksRef.current.onRavitaillementDeleted) {
          callbacksRef.current.onRavitaillementDeleted(id);
        }
      });

      // Charger les données initiales
      fetchInitialData();
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchInitialData, startPollingFallback]);

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
      
      // En mode production, mettre à jour immédiatement
      if (isProductionRef.current) {
        setRavitaillements(prev => [newRavitaillement, ...prev]);
        setLastUpdated(new Date());
        if (callbacksRef.current.onRavitaillementCreated) {
          callbacksRef.current.onRavitaillementCreated(newRavitaillement);
        }
      }
      
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
      
      // En mode production, mettre à jour immédiatement
      if (isProductionRef.current) {
        setRavitaillements(prev => 
          prev.map(r => r.id === id ? updatedRavitaillement : r)
        );
        setLastUpdated(new Date());
        if (callbacksRef.current.onRavitaillementUpdated) {
          callbacksRef.current.onRavitaillementUpdated(updatedRavitaillement);
        }
      }
      
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

      // En mode production, mettre à jour immédiatement
      if (isProductionRef.current) {
        setRavitaillements(prev => prev.filter(r => r.id !== id));
        setLastUpdated(new Date());
        if (callbacksRef.current.onRavitaillementDeleted) {
          callbacksRef.current.onRavitaillementDeleted(id);
        }
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
    isConnected: isProductionRef.current ? true : isConnected, // Simuler "connecté" en production
    lastUpdated,
    createRavitaillement,
    updateRavitaillement,
    deleteRavitaillement,
    refresh,
  };
}
