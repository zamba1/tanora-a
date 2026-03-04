import React from 'react';

import { styled } from '@mui/material/styles';
import { Typography, TypographyProps } from '@mui/material';

// ----------------------------------------------------------------------

interface GradientTextProps extends Omit<TypographyProps, 'color' | 'variant'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'custom';
  gradient?: string;
  fontSize?: string | number;
  fontWeight?: number | string;
}

const StyledTypography = styled(Typography)<{
  gradient: string;
  fontSize?: string | number;
  fontWeight?: number | string;
}>(({ theme, gradient, fontSize, fontWeight }) => ({
  background: gradient,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundSize: '200% 200%',
  // animation: 'gradientShift 3s ease-in-out infinite',
  fontSize: fontSize || 'inherit',
  fontWeight: fontWeight || 'inherit',
//   '@keyframes gradientShift': {
//     '0%': {
//       backgroundPosition: '0% 50%',
//     },
//     '50%': {
//       backgroundPosition: '100% 50%',
//     },
//     '100%': {
//       backgroundPosition: '0% 50%',
//     },
//   },
}));

// ----------------------------------------------------------------------

const gradientVariants = {
  // Brand identity gradients (Green #087557, Blue #395276, Orange #EC671B)
  primary: 'linear-gradient(135deg, #3DA87E 0%, #087557 45%, #065A43 100%)',
  secondary: 'linear-gradient(135deg, #7591B6 0%, #395276 45%, #2A3E5B 100%)',
  accent: 'linear-gradient(135deg, #F5A468 0%, #EC671B 45%, #B94E12 100%)',
  custom: '', // Sera défini par la prop gradient
};

export default function GradientText({
  children,
  variant = 'primary',
  gradient,
  fontSize,
  fontWeight,
  ...other
}: GradientTextProps) {
  const selectedGradient = variant === 'custom' ? gradient : gradientVariants[variant];

  if (!selectedGradient) {
    console.warn('GradientText: gradient is required when variant is "custom"');
    return <Typography {...other}>{children}</Typography>;
  }

  return (
    <StyledTypography
      gradient={selectedGradient}
      fontSize={fontSize}
      fontWeight={fontWeight}
      {...other}
    >
      {children}
    </StyledTypography>
  );
}
