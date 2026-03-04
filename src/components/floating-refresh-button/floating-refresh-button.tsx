import { Fab, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface FloatingRefreshButtonProps {
  onRefresh: () => void;
  disabled?: boolean;
}

export function FloatingRefreshButton({ onRefresh, disabled = false }: FloatingRefreshButtonProps) {
  return (
    <Tooltip title="Actualiser les données">
      <Fab
        color="primary"
        aria-label="refresh"
        onClick={onRefresh}
        disabled={disabled}
        sx={{
          position: 'fixed',
          bottom: 54,
          left: 24,
          zIndex: 9000,
        }}
      >
        <Refresh />
      </Fab>
    </Tooltip>
  );
}
