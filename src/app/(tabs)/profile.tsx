import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, Button, Card, Chip, List, Text } from 'react-native-paper';

import { useAuth } from '@/contexts/AuthContext';

function initials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card mode="elevated">
        <Card.Content style={styles.header}>
          <Avatar.Text size={64} label={initials(user?.name)} />
          <View style={styles.headerText}>
            <Text variant="titleLarge">{user?.name ?? 'Usuario'}</Text>
            <Text variant="bodyMedium" style={styles.muted}>
              {user?.email}
            </Text>
            <View style={styles.badges}>
              <Chip compact icon={isSeller ? 'store' : 'account'}>
                {isSeller ? 'Vendedor' : 'Comprador'}
              </Chip>
              {user?.isVerifiedSeller ? (
                <Chip compact icon="check-decagram" style={styles.verified}>
                  Verificado
                </Chip>
              ) : null}
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card mode="outlined" style={styles.section}>
        {user?.reputation != null ? (
          <List.Item
            title="Reputación"
            description={`${user.reputation}`}
            left={(props) => <List.Icon {...props} icon="star" />}
          />
        ) : null}
        <List.Item
          title="Verificación de identidad (DNI)"
          description={
            user?.isVerifiedSeller
              ? 'Tu identidad está verificada'
              : 'Verifica tu DNI para vender con confianza'
          }
          left={(props) => <List.Icon {...props} icon="card-account-details" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/verify-dni')}
        />
      </Card>

      <Button
        mode="contained-tonal"
        icon="logout"
        onPress={signOut}
        style={styles.logout}
      >
        Cerrar sesión
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerText: { flex: 1, gap: 4 },
  muted: { opacity: 0.7 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  verified: { backgroundColor: '#c8e6c9' },
  section: { overflow: 'hidden' },
  logout: { marginTop: 8 },
});
