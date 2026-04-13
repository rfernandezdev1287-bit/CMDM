import { createTheme } from '@mui/material/styles';

const RFDEV_Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Gold
    },
    background: {
      default: '#050505',
      paper: '#121212',
    },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(18, 18, 18, 0.85)',
        },
      },
    },
  },
});

export default RFDEV_Theme;
