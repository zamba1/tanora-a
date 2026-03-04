/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable default-case */

'use client';

import './leaflet.css';

import L from 'leaflet';
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';

import { Map, MyLocation } from '@mui/icons-material';
import { Box, Alert, Button, Typography, CircularProgress } from '@mui/material';

// Import dynamique pour éviter les problèmes SSR avec Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
      <CircularProgress />
    </Box>
  ),
});

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false,
});

// Import direct de useMapEvents car c'est un hook
import { useMapEvents } from 'react-leaflet';

// Créer une icône personnalisée avec Material-UI (côté client uniquement)
const createCustomIcon = () => {
  if (typeof window === 'undefined') return null;
  
  return L.divIcon({
    html: `
      <div style="
        background-color: #1976d2;
        border: 2px solid white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <svg style="color: white; width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: number;
  disabled?: boolean;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  height = 300,
  disabled = false,
}: LocationPickerProps) {
  // Centre par défaut sur Antananarivo, Madagascar
  const defaultCenter: [number, number] = [-18.8792, 47.5079];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const markerRef = useRef<any>(null);

  // Mettre à jour le centre de la carte quand les coordonnées changent
  useEffect(() => {
    if (latitude && longitude && latitude !== 0 && longitude !== 0) {
      setMapCenter([latitude, longitude]);
    } else {
      // Si pas de coordonnées valides, centrer sur Antananarivo
      setMapCenter(defaultCenter);
    }
  }, [latitude, longitude]);

  // Fonction pour obtenir la position actuelle de l'utilisateur
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par ce navigateur');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const newLocation: [number, number] = [lat, lng];
        
        setUserLocation(newLocation);
        setMapCenter(newLocation);
        onLocationChange(lat, lng);
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Erreur lors de la géolocalisation';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout de géolocalisation';
            break;
        }
        
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Composant pour gérer les événements de clic sur la carte
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        if (!disabled) {
          const { lat, lng } = e.latlng;
          onLocationChange(lat, lng);
        }
      },
    });
    return null;
  };

  // Fonction pour centrer la carte sur la position sélectionnée
  const centerOnMarker = () => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Cliquez sur la carte pour sélectionner une position
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={isLoadingLocation ? <CircularProgress size={16} /> : <MyLocation />}
            onClick={getCurrentLocation}
            disabled={disabled || isLoadingLocation}
            variant="outlined"
          >
            Ma position
          </Button>
          <Button
            size="small"
            startIcon={<Map />}
            onClick={centerOnMarker}
            disabled={disabled || !latitude || !longitude}
            variant="outlined"
          >
            Centrer
          </Button>
        </Box>
      </Box>

      {locationError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {locationError}
        </Alert>
      )}

      <Box 
        sx={{ 
          height, 
          width: '100%', 
          borderRadius: 1, 
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marqueur pour la position sélectionnée */}
          {latitude && longitude && (
            <Marker
              position={[latitude, longitude]}
              ref={markerRef}
              icon={createCustomIcon() || undefined}
            >
              <div>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  Position sélectionnée
                </Typography>
                <br />
                <Typography variant="caption">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </Typography>
              </div>
            </Marker>
          )}

          {/* Marqueur pour la position de l'utilisateur */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={new (require('leaflet').Icon)({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <div>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  Votre position
                </Typography>
              </div>
            </Marker>
          )}

          <MapClickHandler />
        </MapContainer>
      </Box>

      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Coordonnées: {latitude ? latitude.toFixed(6) : 'N/A'}, {longitude ? longitude.toFixed(6) : 'N/A'}
        </Typography>
        {userLocation && (
          <Typography variant="caption" color="primary">
            Position détectée
          </Typography>
        )}
      </Box>
    </Box>
  );
}
