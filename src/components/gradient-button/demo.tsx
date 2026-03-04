import React from 'react';

import { Share, Download, ArrowForward } from '@mui/icons-material';
import { Box, Grid, Stack, Container, Typography } from '@mui/material';

import GradientButton from './gradient-button';

// ----------------------------------------------------------------------

export default function GradientButtonDemo() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Démonstration des Boutons Dégradés
      </Typography>
      
      <Stack spacing={6}>
        {/* Variantes de base */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Variantes de base
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <GradientButton variant="primary">
              Bouton Primary
            </GradientButton>
            <GradientButton variant="secondary">
              Bouton Secondary
            </GradientButton>
            <GradientButton variant="accent">
              Bouton Accent
            </GradientButton>
            <GradientButton 
              variant="custom"
              gradient="linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #8E33FF 100%)"
            >
              Bouton Custom
            </GradientButton>
          </Stack>
        </Box>

        {/* Tailles différentes */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Tailles différentes
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <GradientButton variant="primary" size="small">
              Petit
            </GradientButton>
            <GradientButton variant="primary" size="medium">
              Moyen
            </GradientButton>
            <GradientButton variant="primary" size="large">
              Grand
            </GradientButton>
          </Stack>
        </Box>

        {/* Avec icônes */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Avec icônes
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <GradientButton 
              variant="primary" 
              startIcon={<Download />}
            >
              Télécharger
            </GradientButton>
            <GradientButton 
              variant="secondary" 
              endIcon={<ArrowForward />}
            >
              Continuer
            </GradientButton>
            <GradientButton 
              variant="accent" 
              startIcon={<Share />}
              endIcon={<ArrowForward />}
            >
              Partager
            </GradientButton>
          </Stack>
        </Box>

        {/* Boutons pleine largeur */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Boutons pleine largeur
          </Typography>
          <Stack spacing={2}>
            <GradientButton variant="primary" fullWidth>
              Bouton pleine largeur Primary
            </GradientButton>
            <GradientButton variant="secondary" fullWidth>
              Bouton pleine largeur Secondary
            </GradientButton>
          </Stack>
        </Box>

        {/* États spéciaux */}
        <Box>
          <Typography variant="h6" gutterBottom>
            États spéciaux
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <GradientButton variant="primary">
              Normal
            </GradientButton>
            <GradientButton variant="primary" disabled>
              Désactivé
            </GradientButton>
          </Stack>
        </Box>

        {/* Exemples d'utilisation réelle */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Exemples d&apos;utilisation réelle
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Explorer les Connaissances
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Découvrez notre portail de capitalisation
                </Typography>
                <GradientButton 
                  variant="primary" 
                  fullWidth
                  endIcon={<ArrowForward />}
                >
                  Commencer
                </GradientButton>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Télécharger le rapport
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Accédez aux données complètes
                </Typography>
                <GradientButton 
                  variant="secondary" 
                  fullWidth
                  startIcon={<Download />}
                >
                  Télécharger
                </GradientButton>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Partager les résultats
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Diffusez les connaissances
                </Typography>
                <GradientButton 
                  variant="accent" 
                  fullWidth
                  startIcon={<Share />}
                >
                  Partager
                </GradientButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
