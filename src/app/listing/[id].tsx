import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Card, Chip, Divider, Text } from 'react-native-paper';

import { ErrorView } from '@/components/ErrorView';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StoreMap } from '@/components/StoreMap';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useFetch } from '@/hooks/useFetch';
import { getListing } from '@/services/listings';
import { createOrder } from '@/services/orders';
import { Listing } from '@/types/api';
import { formatCurrency } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';

function coverUri(listing: Listing): string | undefined {
  return listing.imageUrl ?? listing.images?.[0]?.url;
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const [buying, setBuying] = useState(false);

  const { data: listing, loading, error, refetch } = useFetch<Listing>(
    (signal) => getListing(id, signal),
    [id],
  );

  const buy = async () => {
    if (!listing) return;
    setBuying(true);
    try {
      await createOrder(listing.id);
      showSuccess('¡Compra realizada! Revisa tus órdenes.');
      router.replace('/(tabs)/orders');
    } catch (e) {
      showError(getErrorMessage(e));
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <LoadingScreen message="Cargando producto…" />;
  if (error || !listing) {
    return <ErrorView message={error ?? 'Producto no encontrado.'} onRetry={refetch} />;
  }

  const uri = coverUri(listing);
  const isAuction = listing.mode === 'AUCTION';
  const hasLocation =
    listing.latitude != null && listing.longitude != null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {uri ? (
        <Image source={{ uri }} style={styles.cover} contentFit="cover" />
      ) : null}

      <Text variant="headlineSmall" style={styles.title}>
        {listing.title}
      </Text>
      <Text variant="headlineSmall" style={styles.price}>
        {formatCurrency(listing.price)}
      </Text>

      <View style={styles.chips}>
        {listing.mode ? (
          <Chip icon={isAuction ? 'gavel' : 'tag'}>
            {isAuction ? 'Subasta' : 'Venta directa'}
          </Chip>
        ) : null}
        {listing.condition ? <Chip>{listing.condition}</Chip> : null}
      </View>

      {listing.sellerName ? (
        <Text variant="bodyMedium" style={styles.muted}>
          Vendedor: {listing.sellerName}
        </Text>
      ) : null}

      {listing.description ? (
        <>
          <Divider style={styles.divider} />
          <Text variant="bodyLarge">{listing.description}</Text>
        </>
      ) : null}

      {hasLocation ? (
        <>
          <Divider style={styles.divider} />
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Ubicación de la tienda
          </Text>
          <StoreMap
            coordinate={{
              latitude: listing.latitude as number,
              longitude: listing.longitude as number,
            }}
            title={listing.storeName ?? listing.title}
          />
        </>
      ) : null}

      <Divider style={styles.divider} />
      {isAuction ? (
        <Button
          mode="contained"
          icon="gavel"
          onPress={() => router.push('/(tabs)/auctions')}
        >
          Ver subastas
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="cart"
          loading={buying}
          disabled={buying}
          onPress={buy}
        >
          Comprar ahora
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 8 },
  cover: { width: '100%', height: 240, borderRadius: 12 },
  title: { fontWeight: '700', marginTop: 8 },
  price: { color: '#208AEF', fontWeight: '800' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  muted: { opacity: 0.7, marginTop: 4 },
  divider: { marginVertical: 12 },
  sectionTitle: { marginBottom: 8 },
});
