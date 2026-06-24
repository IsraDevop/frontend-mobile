import 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/contexts/AuthContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { darkTheme, lightTheme } from '@/theme/paper-theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <SnackbarProvider>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen
                  name="listing/[id]"
                  options={{ headerShown: true, title: 'Detalle del producto' }}
                />
                <Stack.Screen
                  name="auction/[id]"
                  options={{ headerShown: true, title: 'Subasta' }}
                />
                <Stack.Screen
                  name="verify-dni"
                  options={{
                    headerShown: true,
                    title: 'Verificar DNI',
                    presentation: 'modal',
                  }}
                />
              </Stack>
            </SnackbarProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
