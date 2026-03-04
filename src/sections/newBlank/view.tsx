'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export function BlankView({ title = 'Blank', description, sx, children }: Props) {

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>
      {description && <Typography sx={{ mt: 1 }}> {description} </Typography>}

      {children}
    </DashboardContent>
  );
}
