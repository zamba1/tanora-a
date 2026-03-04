/**
 * Utilitaires pour le formatage des dates de manière cohérente entre serveur et client
 */

/**
 * Formate une date de manière cohérente pour éviter les erreurs d'hydratation
 * @param dateString - Date au format string
 * @param isClient - Indique si on est côté client
 * @returns Date formatée
 */
export function formatDate(dateString: string, isClient: boolean = false): string {
  const date = new Date(dateString);
  
  if (isClient) {
    // Côté client : formatage localisé
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } else {
    // Côté serveur : format ISO simple
    return date.toISOString().split('T')[0];
  }
}

/**
 * Formate une date avec heure de manière cohérente
 * @param dateString - Date au format string
 * @param isClient - Indique si on est côté client
 * @returns Date et heure formatées
 */
export function formatDateTime(dateString: string, isClient: boolean = false): string {
  const date = new Date(dateString);
  
  if (isClient) {
    // Côté client : formatage localisé
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    // Côté serveur : format ISO simple
    return date.toISOString().replace('T', ' ').split('.')[0];
  }
}

/**
 * Formate une date relative (ex: "il y a 2 jours")
 * @param dateString - Date au format string
 * @param isClient - Indique si on est côté client
 * @returns Date relative formatée
 */
export function formatRelativeDate(dateString: string, isClient: boolean = false): string {
  if (!isClient) {
    return formatDate(dateString, false);
  }

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Aujourd'hui";
  } else if (diffInDays === 1) {
    return "Hier";
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jours`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    return formatDate(dateString, true);
  }
}
