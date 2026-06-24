import { Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return <LoadingScreen message="Cargando Yala…" />;
  }
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
