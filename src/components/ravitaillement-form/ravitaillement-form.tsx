import { useState, useEffect } from 'react';

import {
  Box,
  Alert,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';

import { LocationPicker } from '../location-picker';

interface Ravitaillement {
  id: number;
  nomGroup: string;
  latitude: number;
  longitude: number;
  adresse: string;
  createdAt: string;
  updatedAt: string;
}

interface RavitaillementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nomGroup: string;
    latitude: number;
    longitude: number;
    adresse: string;
  }) => Promise<void>;
  editingRavitaillement?: Ravitaillement | null;
  loading?: boolean;
}

export function RavitaillementForm({
  open,
  onClose,
  onSubmit,
  editingRavitaillement,
  loading = false,
}: RavitaillementFormProps) {
  const [formData, setFormData] = useState({
    nomGroup: '',
    latitude: '',
    longitude: '',
    adresse: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Remplir le formulaire lors de l'édition
  useEffect(() => {
    if (editingRavitaillement) {
      setFormData({
        nomGroup: editingRavitaillement.nomGroup,
        latitude: editingRavitaillement.latitude.toString(),
        longitude: editingRavitaillement.longitude.toString(),
        adresse: editingRavitaillement.adresse,
      });
    } else {
      setFormData({
        nomGroup: '',
        latitude: '',
        longitude: '',
        adresse: '',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [editingRavitaillement, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomGroup.trim()) {
      newErrors.nomGroup = 'Le nom du groupe est requis';
    }

    if (!formData.latitude.trim()) {
      newErrors.latitude = 'La latitude est requise';
    } else {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'La latitude doit être entre -90 et 90';
      }
    }

    if (!formData.longitude.trim()) {
      newErrors.longitude = 'La longitude est requise';
    } else {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'La longitude doit être entre -180 et 180';
      }
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError(null);
      await onSubmit({
        nomGroup: formData.nomGroup.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        adresse: formData.adresse.trim(),
      });
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
    // Effacer les erreurs de latitude/longitude si elles existent
    if (errors.latitude || errors.longitude) {
      setErrors(prev => ({
        ...prev,
        latitude: '',
        longitude: '',
      }));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        {editingRavitaillement ? 'Modifier le ravitaillement' : 'Ajouter un ravitaillement'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {/* Onglets pour organiser le formulaire */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="form tabs">
              <Tab label="Informations générales" />
              <Tab label="Position géographique" />
            </Tabs>
          </Box>

          {/* Contenu de l'onglet Informations générales */}
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Nom du groupe"
                value={formData.nomGroup}
                onChange={(e) => handleInputChange('nomGroup', e.target.value)}
                error={!!errors.nomGroup}
                helperText={errors.nomGroup}
                fullWidth
                disabled={loading}
              />

              <TextField
                label="Details"
                value={formData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                error={!!errors.adresse}
                helperText={errors.adresse}
                fullWidth
                multiline
                rows={2}
                disabled={loading}
              />
            </Box>
          )}

          {/* Contenu de l'onglet Position géographique */}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Sélectionnez la position sur la carte ou saisissez les coordonnées manuellement
              </Typography>
              
              {/* Carte interactive */}
              <LocationPicker
                latitude={parseFloat(formData.latitude) || 0}
                longitude={parseFloat(formData.longitude) || 0}
                onLocationChange={handleLocationChange}
                height={350}
                disabled={loading}
              />

              {/* Champs de coordonnées pour saisie manuelle */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  error={!!errors.latitude}
                  helperText={errors.latitude}
                  fullWidth
                  type="number"
                  inputProps={{ step: 'any' }}
                  disabled={loading}
                />

                <TextField
                  label="Longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  error={!!errors.longitude}
                  helperText={errors.longitude}
                  fullWidth
                  type="number"
                  inputProps={{ step: 'any' }}
                  disabled={loading}
                />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          color="inherit"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {editingRavitaillement ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
