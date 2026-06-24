import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

import { AuctionCard } from '@/components/AuctionCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { listActiveAuctions } from '@/services/auctions';
import { Auction } from '@/types/api';

export default function AuctionsScreen() {
  const router = useRouter();

  const fetchPage = useCallback(
    (page: number, signal: AbortSignal) =>
      listActiveAuctions({ page }, signal),
    [],
  );

  const {
    items,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
  } = usePaginatedList<Auction>(fetchPage, []);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <AuctionCard
          auction={item}
          onPress={() => router.push(`/auction/${item.id}`)}
        />
      )}
      contentContainerStyle={styles.content}
      onRefresh={refresh}
      refreshing={refreshing}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={styles.footer} /> : null
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator style={styles.empty} size="large" />
        ) : error ? (
          <ErrorView message={error} onRetry={refresh} />
        ) : (
          <EmptyState
            icon="gavel"
            title="No hay subastas activas"
            description="Vuelve más tarde para encontrar nuevas pujas."
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, flexGrow: 1 },
  footer: { marginVertical: 16 },
  empty: { marginTop: 48 },
});
