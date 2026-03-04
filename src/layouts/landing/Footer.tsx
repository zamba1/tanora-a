import React from 'react';

import { Twitter, YouTube, Facebook, LinkedIn } from '@mui/icons-material';
import { Box, Stack, Container, IconButton, Typography, Link as MuiLink } from '@mui/material';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.default', borderTop: (theme) => `1px solid ${theme.palette.divider}`, py: 3 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            © {year} MIONJO — Tous droits réservés
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton color="primary" component={MuiLink} href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton color="primary" component={MuiLink} href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton color="primary" component={MuiLink} href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
            <IconButton color="primary" component={MuiLink} href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <YouTube />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}


