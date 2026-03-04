import React from 'react';

import { Box, Stack, Container, Typography } from '@mui/material';

import GradientText from './gradient-text';

// ----------------------------------------------------------------------

export default function GradientTextDemo() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Démonstration des Textes Dégradés
      </Typography>
      
      <Stack spacing={4}>
        {/* Variante Primary */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Variante Primary (Rose-Violet avec animation)
          </Typography>
          <GradientText 
            variant="primary" 
            fontSize="3rem" 
            fontWeight="bold"
            component="h1"
          >
            Capitalisation Projet MIONJO
          </GradientText>
        </Box>

        {/* Variante Secondary */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Variante Secondary (Violet profond)
          </Typography>
          <GradientText 
            variant="secondary" 
            fontSize="2.5rem" 
            fontWeight="600"
            component="h2"
          >
            Transformer l&apos;expérience de terrain
          </GradientText>
        </Box>

        {/* Variante Accent */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Variante Accent (Rose-Magenta)
          </Typography>
          <GradientText 
            variant="accent" 
            fontSize="2rem" 
            fontWeight="500"
            component="h3"
          >
            Renforcer la résilience territoriale
          </GradientText>
        </Box>

        {/* Variante Custom */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Variante Custom (Dégradé personnalisé)
          </Typography>
          <GradientText 
            variant="custom"
            gradient="linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #8E33FF 100%)"
            fontSize="1.8rem" 
            fontWeight="500"
            component="h4"
          >
            Savoir stratégique pour l&apos;avenir
          </GradientText>
        </Box>

        {/* Exemple avec texte plus petit */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Texte plus petit avec dégradé
          </Typography>
          <GradientText 
            variant="primary" 
            fontSize="1.2rem" 
            fontWeight="400"
            component="p"
          >
            Ce composant s&apos;adapte à toutes les tailles de texte et s&apos;intègre parfaitement avec Material-UI.
          </GradientText>
        </Box>
      </Stack>
    </Container>
  );
}
