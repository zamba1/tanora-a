"use client";

import React, { useMemo, useState } from 'react';

import {
  Box,
  Tab,
  Grid,
  Chip,
  Tabs,
  Paper,
  Divider,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import { Iconify } from '../iconify';

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
}

// Catégories d'icônes Material avec des exemples
const iconCategories = {
  'Général': [
    'material-symbols:home-outline',
    'material-symbols:person-outline',
    'material-symbols:settings-outline',
    'material-symbols:search',
    'material-symbols:menu',
    'material-symbols:close',
    'material-symbols:check',
    'material-symbols:add',
    'material-symbols:remove',
    'material-symbols:edit',
    'material-symbols:delete-outline',
    'material-symbols:save',
    'material-symbols:download',
    'material-symbols:upload',
    'material-symbols:share',
    'material-symbols:print',
    'material-symbols:visibility',
    'material-symbols:visibility-off',
  ],
  'Navigation': [
    'material-symbols:arrow-back',
    'material-symbols:arrow-forward',
    'material-symbols:arrow-upward',
    'material-symbols:arrow-downward',
    'material-symbols:keyboard-arrow-left',
    'material-symbols:keyboard-arrow-right',
    'material-symbols:keyboard-arrow-up',
    'material-symbols:keyboard-arrow-down',
    'material-symbols:expand-more',
    'material-symbols:expand-less',
    'material-symbols:chevron-left',
    'material-symbols:chevron-right',
    'material-symbols:chevron-up',
    'material-symbols:chevron-down',
  ],
  'Communication': [
    'material-symbols:email',
    'material-symbols:phone',
    'material-symbols:chat',
    'material-symbols:message',
    'material-symbols:notifications',
    'material-symbols:notifications-off',
    'material-symbols:call',
    'material-symbols:video-call',
    'material-symbols:mic',
    'material-symbols:mic-off',
    'material-symbols:volume-up',
    'material-symbols:volume-off',
    'material-symbols:speaker-notes',
    'material-symbols:forum',
  ],
  'Fichiers et Documents': [
    'material-symbols:folder',
    'material-symbols:folder-open',
    'material-symbols:insert-drive-file',
    'material-symbols:description',
    'material-symbols:article',
    'material-symbols:note',
    'material-symbols:note-add',
    'material-symbols:sticky-note-2',
    'material-symbols:attach-file',
    'material-symbols:link',
    'material-symbols:content-copy',
    'material-symbols:cut',
    'material-symbols:paste',
    'material-symbols:archive',
  ],
  'Données et Analytics': [
    'material-symbols:analytics',
    'material-symbols:bar-chart',
    'material-symbols:pie-chart',
    'material-symbols:line-chart',
    'material-symbols:show-chart',
    'material-symbols:trending-up',
    'material-symbols:trending-down',
    'material-symbols:data-usage',
    'material-symbols:storage',
    'material-symbols:database',
    'material-symbols:table-chart',
    'material-symbols:grid-view',
    'material-symbols:view-list',
    'material-symbols:view-module',
  ],
  'Éducation et Formation': [
    'material-symbols:school',
    'material-symbols:book',
    'material-symbols:library-books',
    'material-symbols:menu-book',
    'material-symbols:auto-stories',
    'material-symbols:quiz',
    'material-symbols:assignment',
    'material-symbols:assignment-turned-in',
    'material-symbols:grading',
    'material-symbols:class',
    'material-symbols:group',
    'material-symbols:person-add',
    'material-symbols:supervisor-account',
    'material-symbols:workspace-premium',
  ],
  'Projet et Gestion': [
    'material-symbols:work',
    'material-symbols:business',
    'material-symbols:account-balance',
    'material-symbols:domain',
    'material-symbols:apartment',
    'material-symbols:location-city',
    'material-symbols:public',
    'material-symbols:language',
    'material-symbols:translate',
    'material-symbols:schedule',
    'material-symbols:event',
    'material-symbols:calendar-today',
    'material-symbols:timeline',
    'material-symbols:task',
  ],
  'Technologie': [
    'material-symbols:computer',
    'material-symbols:laptop',
    'material-symbols:phone-android',
    'material-symbols:tablet',
    'material-symbols:smartphone',
    'material-symbols:devices',
    'material-symbols:router',
    'material-symbols:wifi',
    'material-symbols:bluetooth',
    'material-symbols:cloud',
    'material-symbols:cloud-upload',
    'material-symbols:cloud-download',
    'material-symbols:sync',
    'material-symbols:refresh',
  ],
  'Sécurité et Statut': [
    'material-symbols:security',
    'material-symbols:lock',
    'material-symbols:lock-open',
    'material-symbols:verified',
    'material-symbols:verified-user',
    'material-symbols:admin-panel-settings',
    'material-symbols:shield',
    'material-symbols:warning',
    'material-symbols:error',
    'material-symbols:info',
    'material-symbols:help',
    'material-symbols:help-outline',
    'material-symbols:priority-high',
    'material-symbols:flag',
  ],
  'Interface Utilisateur': [
    'material-symbols:dashboard',
    'material-symbols:apps',
    'material-symbols:widgets',
    'material-symbols:view-dashboard',
    'material-symbols:view-sidebar',
    'material-symbols:view-column',
    'material-symbols:view-agenda',
    'material-symbols:view-day',
    'material-symbols:view-week',
    'material-symbols:view-month',
    'material-symbols:view-quilt',
    'material-symbols:view-comfy',
    'material-symbols:view-compact',
    'material-symbols:view-headline',
  ],
};

export function IconSelector({ onSelect }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Général');

  // Filtrer les icônes selon la recherche
  const filteredIcons = useMemo(() => {
    const categoryIcons = iconCategories[selectedCategory as keyof typeof iconCategories] || [];
    
    if (!searchTerm) {
      return categoryIcons;
    }

    return categoryIcons.filter(icon => 
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, selectedCategory]);

  const handleIconClick = (iconName: string) => {
    onSelect(iconName);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barre de recherche */}
      <TextField
        fullWidth
        placeholder="Rechercher une icône..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="material-symbols:search" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Onglets des catégories */}
      <Tabs
        value={selectedCategory}
        onChange={(_, newValue) => setSelectedCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {Object.keys(iconCategories).map((category) => (
          <Tab key={category} label={category} value={category} />
        ))}
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {/* Grille d'icônes */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {filteredIcons.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Iconify icon="material-symbols:search-off" sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Aucune icône trouvée
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1}>
            {filteredIcons.map((iconName) => (
              <Grid size={{ xs: 2, sm: 1.5, md: 1 }} key={iconName}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => handleIconClick(iconName)}
                >
                  <Iconify icon={iconName} sx={{ fontSize: 24, mb: 1 }} />
                  <Typography variant="caption" display="block" noWrap>
                    {iconName.split(':')[1]?.replace(/-/g, ' ') || iconName}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Icônes récemment utilisées (optionnel) */}
      {!searchTerm && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            Icônes populaires
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {[
              'material-symbols:home-outline',
              'material-symbols:person-outline',
              'material-symbols:settings-outline',
              'material-symbols:folder',
              'material-symbols:analytics',
              'material-symbols:school',
              'material-symbols:work',
              'material-symbols:computer',
            ].map((iconName) => (
              <Chip
                key={iconName}
                icon={<Iconify icon={iconName} />}
                label={iconName.split(':')[1]?.replace(/-/g, ' ') || iconName}
                onClick={() => handleIconClick(iconName)}
                variant="outlined"
                clickable
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
