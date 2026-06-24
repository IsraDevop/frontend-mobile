import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ColorValue } from 'react-native';
import { Redirect, Tabs } from 'expo-router';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

function tabIcon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <MaterialCommunityIcons name={name} color={color as string} size={size} />
  );
}

export default function TabsLayout() {
  const { initializing, isAuthenticated, user } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Explorar', tabBarIcon: tabIcon('storefront') }}
      />
      <Tabs.Screen
        name="auctions"
        options={{ title: 'Subastas', tabBarIcon: tabIcon('gavel') }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Vender',
          tabBarIcon: tabIcon('plus-box'),
          href: isSeller ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Órdenes', tabBarIcon: tabIcon('receipt') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: tabIcon('account') }}
      />
    </Tabs>
  );
}
