'use client';

 // Le header contient des liens interactifs

import React from 'react';
import Link from 'next/link';

import { Box, AppBar, Button, Toolbar, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { Logo } from 'src/components/logo';
import GradientButton from 'src/components/gradient-button/gradient-button';

// Remplacez par le chemin de votre logo
const LOGO_URL = '/logo.svg'; // Utilisez le logo Geo Systems comme inspiration

export default function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: 'none',
        bgcolor: 'background.default',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* --- LOGO --- */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo/>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* --- LIENS DE NAVIGATION --- */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}     
              href={paths.auth.jwt.signIn} // Lien vers la page de connexion
              variant="text"
              sx={{ color: 'text.secondary' }}
            >
              Se connecter
            </Button>
            
            <GradientButton
              component={Link}
              href="/themes" // Lien vers la page de la liste des connaissances
              variant="primary"
            >
              Connaissances
            </GradientButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}