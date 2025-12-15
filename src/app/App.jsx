
import { ThemeSettings } from '../theme/Theme';
import RTL from '../components/layout/full/shared/customizer/RTL';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppRoutes from "./routes";
import { CustomizerContext } from '../components/context/CustomizerContext';
import { useContext } from 'react';

function App() {
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);
  return (
    <ThemeProvider theme={theme}>
      <RTL direction={activeDir}>
        <CssBaseline />
             <AppRoutes />
      </RTL>
    </ThemeProvider>
  );
}

export default App
