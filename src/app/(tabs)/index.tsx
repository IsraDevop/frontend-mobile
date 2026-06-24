import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Chip, Searchbar } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { ListingCard } from '@/components/ListingCard';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { listListings } from '@/services/listings';
import { Listing } from '@/types/api';

const MODE_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'DIRECT', label: 'Venta directa' },
  { value: 'AUCTION', label: 'Subasta' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('');

  // Debounce the search box to avoid a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPage = useCallback(
    (page: number, signal: AbortSignal) =>
      listListings(
        { page, q: query || undefined, mode: mode || undefined },
        signal,
      ),
    [query, mode],
  );

  const {
    items,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
  } = usePaginatedList<Listing>(fetchPage, [query, mode]);

  const header = (
    <View style={styles.header}>
      <Searchbar
        placeholder="Buscar coleccionables…"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <View style={styles.chips}>
        {MODE_FILTERS.map((filter) => (
          <Chip
            key={filter.value || 'all'}
            selected={mode === filter.value}
            onPress={() => setMode(filter.value)}
            showSelectedCheck
          >
            {filter.label}
          </Chip>
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ListingCard
          listing={item}
          onPress={() => router.push(`/listing/${item.id}`)}
        />
      )}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
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
            icon="storefront-outline"
            title="Sin resultados"
            description="No encontramos productos con esos filtros."
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, flexGrow: 1 },
  header: { gap: 12, marginBottom: 12 },
  search: { borderRadius: 12 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  footer: { marginVertical: 16 },
  empty: { marginTop: 48 },
});
