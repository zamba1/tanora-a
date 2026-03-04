/* eslint-disable consistent-return */
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

  // Initialiser la connexion Socket.io
  useEffect(() => {
    // Ne pas essayer de se connecter en WebSocket sur Vercel
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      console.log('⚠️ WebSocket non supporté sur Vercel, utilisation du hook SSE');
      setIsConnected(false);
      setLoading(false);
      return;
    }

    const serverUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8083'
      : window.location.origin;

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

    // Cleanup
    return () => {
      socket.disconnect();
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
      
      // Rafraîchir les données automatiquement après création
      setTimeout(() => {
        fetchInitialData();
      }, 100);
      
      return newRavitaillement;
    } catch (err) {
      console.error('Error creating ravitaillement:', err);
      throw err;
    }
  }, [fetchInitialData]);

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
      
      // Rafraîchir les données automatiquement après modification
      setTimeout(() => {
        fetchInitialData();
      }, 100);
      
      return updatedRavitaillement;
    } catch (err) {
      console.error('Error updating ravitaillement:', err);
      throw err;
    }
  }, [fetchInitialData]);

  const deleteRavitaillement = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/ravitaillements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete ravitaillement');
      }

      // Rafraîchir les données automatiquement après suppression
      setTimeout(() => {
        fetchInitialData();
      }, 100);

      return true;
    } catch (err) {
      console.error('Error deleting ravitaillement:', err);
      throw err;
    }
  }, [fetchInitialData]);

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
