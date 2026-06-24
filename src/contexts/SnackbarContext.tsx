import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Snackbar } from 'react-native-paper';

type Variant = 'success' | 'error' | 'info';

interface SnackbarContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const VARIANT_COLOR: Record<Variant, string | undefined> = {
  success: '#2e7d32',
  error: '#c62828',
  info: undefined,
};

/** Global toast/snackbar used for success confirmations and error feedback. */
export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<Variant>('info');

  const show = useCallback((text: string, kind: Variant) => {
    setMessage(text);
    setVariant(kind);
    setVisible(true);
  }, []);

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showSuccess: (m) => show(m, 'success'),
      showError: (m) => show(m, 'error'),
      showInfo: (m) => show(m, 'info'),
    }),
    [show],
  );

  const backgroundColor = VARIANT_COLOR[variant];

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3500}
        style={backgroundColor ? { backgroundColor } : undefined}
        action={{ label: 'OK', onPress: () => setVisible(false) }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return ctx;
}
