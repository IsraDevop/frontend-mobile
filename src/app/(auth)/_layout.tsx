import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
