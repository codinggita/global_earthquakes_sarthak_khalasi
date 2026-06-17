import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, actions, maxWidth = 'sm', fullWidth = true }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          background: 'var(--color-surface-card)',
          backgroundImage: 'none',
          boxShadow: 'var(--glass-shadow)',
          border: '1px solid var(--color-border)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: '1.125rem',
          color: 'var(--color-text-primary)',
          pb: 1,
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'var(--color-text-secondary)',
            '&:hover': { backgroundColor: 'var(--color-border-light)' },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          color: 'var(--color-text-primary)',
          '& .MuiInputBase-root': {
            color: 'var(--color-text-primary)',
          },
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
