import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import RFDEV_Theme from './theme/RFDEV_Theme';
import { Dashboard } from './presentation/components/Dashboard/Dashboard';

function App() {
  return (
    <ThemeProvider theme={RFDEV_Theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
