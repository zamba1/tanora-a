import React from 'react';

import { styled } from '@mui/material/styles';
import { Button, ButtonProps } from '@mui/material';

// ----------------------------------------------------------------------

interface GradientButtonProps extends Omit<ButtonProps, 'color' | 'variant'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'custom';
  gradient?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const StyledButton = styled(Button)<{
  gradient: string;
  size: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}>(({ theme, gradient, size, fullWidth }) => ({
  background: gradient,
  backgroundSize: '200% 200%',
  border: 'none',
  borderRadius: theme.spacing(1),
  color: '#FFFFFF',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  // Tailles personnalisées
  ...(size === 'small' && {
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
    minHeight: '32px',
  }),
  ...(size === 'medium' && {
    padding: theme.spacing(1.5, 3),
    fontSize: '1rem',
    minHeight: '40px',
  }),
  ...(size === 'large' && {
    padding: theme.spacing(2, 4),
    fontSize: '1.125rem',
    minHeight: '48px',
  }),

  // Largeur complète
  ...(fullWidth && {
    width: '100%',
  }),

  // Effet de survol
  '&:hover': {
    background: gradient,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 1.5s ease-in-out infinite',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
    transform: 'translateY(-2px)',
  },

  // Effet de clic
  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },

  // État désactivé
  '&:disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500],
    boxShadow: 'none',
    transform: 'none',
    cursor: 'not-allowed',
  },

  // Effet de brillance au survol
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },

  '&:hover::before': {
    left: '100%',
  },

  // Animation du dégradé
  '@keyframes gradientShift': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

// ----------------------------------------------------------------------

const gradientVariants = {
  // Brand identity gradients (Green #087557, Blue #395276, Orange #EC671B)
  primary: 'linear-gradient(135deg, #3DA87E 0%, #087557 45%, #065A43 100%)',
  secondary: 'linear-gradient(135deg, #7591B6 0%, #395276 45%, #2A3E5B 100%)',
  accent: 'linear-gradient(135deg, #F5A468 0%, #EC671B 45%, #B94E12 100%)',
  custom: '', // Sera défini par la prop gradient
};

export default function GradientButton({
  children,
  variant = 'primary',
  gradient,
  size = 'medium',
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  ...other
}: GradientButtonProps) {
  const selectedGradient = variant === 'custom' ? gradient : gradientVariants[variant];

  if (!selectedGradient) {
    console.warn('GradientButton: gradient is required when variant is "custom"');
    return (
      <Button 
        variant="contained" 
        size={size} 
        fullWidth={fullWidth} 
        disabled={disabled}
        startIcon={startIcon}
        endIcon={endIcon}
        {...other}
      >
        {children}
      </Button>
    );
  }

  return (
    <StyledButton
      gradient={selectedGradient}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      {...other}
    >
      {children}
    </StyledButton>
  );
}
