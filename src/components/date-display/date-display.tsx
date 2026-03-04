import type { TypographyProps } from '@mui/material';

import React from 'react';

import { Typography } from '@mui/material';

import ClientOnly from '../client-only';

interface DateDisplayProps extends Omit<TypographyProps, 'children'> {
  dateString: string;
  format?: 'date' | 'datetime' | 'relative';
  fallback?: string;
}

/**
 * Composant pour afficher les dates de manière cohérente entre serveur et client
 */
export default function DateDisplay({ 
  dateString, 
  format = 'date', 
  fallback,
  ...typographyProps 
}: DateDisplayProps) {
  const formatDate = (date: Date, formatType: string) => {
    switch (formatType) {
      case 'datetime':
        return date.toLocaleString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'relative':
        { const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return "Aujourd'hui";
        if (diffInDays === 1) return "Hier";
        if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
        if (diffInDays < 30) {
          const weeks = Math.floor(diffInDays / 7);
          return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
        }
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }); }
      case 'date':
      default:
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
    }
  };

  const date = new Date(dateString);
  const serverFallback = fallback || date.toISOString().split('T')[0];

  return (
    <Typography {...typographyProps}>
      <ClientOnly fallback={serverFallback}>
        {formatDate(date, format)}
      </ClientOnly>
    </Typography>
  );
}
