import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Chip, Divider, HelperText, Text } from 'react-native-paper';

import { ErrorView } from '@/components/ErrorView';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StoreMap } from '@/components/StoreMap';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useFetch } from '@/hooks/useFetch';
import { useLocation } from '@/hooks/useLocation';
import { getListing } from '@/services/listings';
import { createOrder } from '@/services/orders';
import { Listing } from '@/types/api';
import { formatCurrency } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { listingCover, listingPrice } from '@/utils/listing';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const [buying, setBuying] = useState(false);
  const location = useLocation(false);

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

  const uri = listingCover(listing);
  const isAuction = listing.mode === 'AUCTION';
  const sold = listing.status === 'SOLD' || listing.status === 'CANCELLED';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {uri ? (
        <Image source={{ uri }} style={styles.cover} contentFit="cover" />
      ) : null}

      <Text variant="headlineSmall" style={styles.title}>
        {listing.title}
      </Text>
      <Text variant="headlineSmall" style={styles.price}>
        {formatCurrency(listingPrice(listing))}
      </Text>

      <View style={styles.chips}>
        <Chip icon={isAuction ? 'gavel' : 'tag'}>
          {isAuction ? 'Subasta' : 'Venta directa'}
        </Chip>
        {listing.condition ? <Chip>{listing.condition}</Chip> : null}
        {listing.category ? <Chip icon="shape">{listing.category.name}</Chip> : null}
      </View>

      {listing.seller ? (
        <Text variant="bodyMedium" style={styles.muted}>
          Vendedor: {listing.seller.name}
          {listing.seller.reputation != null
            ? `  ·  ⭐ ${listing.seller.reputation.toFixed(1)}`
            : ''}
        </Text>
      ) : null}

      {listing.description ? (
        <>
          <Divider style={styles.divider} />
          <Text variant="bodyLarge">{listing.description}</Text>
        </>
      ) : null}

      <Divider style={styles.divider} />
      {isAuction ? (
        <Button
          mode="contained"
          icon="gavel"
          disabled={!listing.auction}
          onPress={() =>
            listing.auction && router.push(`/auction/${listing.auction.id}`)
          }
        >
          {listing.auction ? 'Ver subasta y pujar' : 'Subasta no disponible'}
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="cart"
          loading={buying}
          disabled={buying || sold}
          onPress={buy}
        >
          {sold ? 'No disponible' : 'Comprar ahora'}
        </Button>
      )}

      {/* GPS + Google Maps: pickup / meet-up location */}
      <Divider style={styles.divider} />
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Punto de encuentro
      </Text>
      {location.coordinate ? (
        <StoreMap coordinate={location.coordinate} title="Tu ubicación" />
      ) : (
        <>
          <Button
            mode="outlined"
            icon="map-marker"
            loading={location.loading}
            onPress={location.request}
          >
            Ver mi ubicación en el mapa
          </Button>
          {location.error ? (
            <HelperText type="error" visible>
              {location.error}
            </HelperText>
          ) : null}
        </>
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
