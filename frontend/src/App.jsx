import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './components/common/ErrorBoundary';
import { getTheme } from './utils/storage';

// ============================================
// MUI Theme synced with Tailwind dark mode
// ============================================
const buildMuiTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
      secondary: { main: '#d946ef' },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
        secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
      },
      divider: mode === 'dark' ? '#334155' : '#e2e8f0',
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    shape: { borderRadius: 12 },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    },
  });

// ============================================
// Inner app component (needs Redux access)
// ============================================
const AppContent = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.ui);
  const muiTheme = buildMuiTheme(theme);

  // Apply Tailwind dark mode class on mount + theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'white' },
          },
        }}
      />
    </ThemeProvider>
  );
};

// ============================================
// Root App with Redux Provider
// ============================================
const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
