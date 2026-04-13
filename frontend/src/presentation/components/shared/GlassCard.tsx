import { Paper, styled } from '@mui/material';

export const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(18, 18, 18, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)', // Safari compat
  border: `1px solid ${theme.palette.primary.main}30`, // Alpha Gold
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  padding: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: `0 8px 32px ${theme.palette.primary.main}15`,
  }
}));
