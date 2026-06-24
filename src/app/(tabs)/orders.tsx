import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Text } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { cancelOrder, confirmOrder, listMyOrders } from '@/services/orders';
import { Order, OrderStatus } from '@/types/api';
import { formatCurrency, formatDate } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#F5A623',
  CONFIRMED: '#2e7d32',
  CANCELLED: '#c62828',
};

function statusLabel(status?: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';
    case 'CONFIRMED':
      return 'Confirmada';
    case 'CANCELLED':
      return 'Cancelada';
    default:
      return status ?? 'Desconocido';
  }
}

function OrderItem({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const { showSuccess, showError } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const status = order.status?.toUpperCase();
  const title = order.listing?.title ?? `Orden #${order.id}`;

  const run = async (action: 'confirm' | 'cancel') => {
    setBusy(true);
    try {
      if (action === 'confirm') {
        await confirmOrder(order.id);
        showSuccess('Orden confirmada.');
      } else {
        await cancelOrder(order.id);
        showSuccess('Orden cancelada.');
      }
      onChanged();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" numberOfLines={1} style={styles.cardTitle}>
            {title}
          </Text>
          <Chip
            compact
            style={{ backgroundColor: STATUS_COLOR[status ?? ''] ?? '#9e9e9e' }}
            textStyle={styles.chipText}
          >
            {statusLabel(order.status)}
          </Chip>
        </View>
        <Text variant="bodyMedium">{formatCurrency(order.amount)}</Text>
        {order.createdAt ? (
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(order.createdAt)}
          </Text>
        ) : null}
        {status === 'PENDING' ? (
          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="check"
              loading={busy}
              disabled={busy}
              onPress={() => run('confirm')}
            >
              Confirmar
            </Button>
            <Button
              mode="outlined"
              icon="close"
              disabled={busy}
              onPress={() => run('cancel')}
            >
              Cancelar
            </Button>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );
}

export default function OrdersScreen() {
  const fetchPage = useCallback(
    (page: number, signal: AbortSignal) => listMyOrders(page, signal),
    [],
  );

  const { items, loading, refreshing, loadingMore, error, refresh, loadMore } =
    usePaginatedList<Order>(fetchPage, []);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <OrderItem order={item} onChanged={refresh} />}
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
            icon="receipt"
            title="Aún no tienes órdenes"
            description="Compra un producto para verlo aquí."
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, flexGrow: 1 },
  card: { marginBottom: 12 },
  cardContent: { gap: 4 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: { flex: 1 },
  chipText: { color: '#fff' },
  date: { opacity: 0.6 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  footer: { marginVertical: 16 },
  empty: { marginTop: 48 },
});
