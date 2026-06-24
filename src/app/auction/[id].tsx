import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, Chip, Divider, List, Text } from 'react-native-paper';

import { BidForm } from '@/components/BidForm';
import { ErrorView } from '@/components/ErrorView';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useFetch } from '@/hooks/useFetch';
import { getAuction } from '@/services/auctions';
import { listBids, placeBid } from '@/services/bids';
import { Auction, Bid, PageResponse } from '@/types/api';
import { formatCurrency, formatDate, timeRemaining } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';

export default function AuctionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccess, showError } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  const {
    data: auction,
    loading,
    error,
    refetch,
  } = useFetch<Auction>((signal) => getAuction(id, signal), [id]);

  const { data: bidsPage, refetch: refetchBids } = useFetch<PageResponse<Bid>>(
    (signal) => listBids(id, signal),
    [id],
  );

  const currentPrice = auction?.currentPrice ?? auction?.startingPrice ?? 0;

  const submitBid = async (amount: number) => {
    setSubmitting(true);
    try {
      await placeBid({ auctionId: Number(id), amount });
      showSuccess('¡Puja registrada!');
      refetch();
      refetchBids();
    } catch (e) {
      showError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen message="Cargando subasta…" />;
  if (error || !auction) {
    return <ErrorView message={error ?? 'Subasta no encontrada.'} onRetry={refetch} />;
  }

  const ended =
    auction.status !== 'ACTIVE' || timeRemaining(auction.endsAt) === 'Finalizada';
  const bids = bidsPage?.content ?? [];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {`Subasta #${auction.id}`}
      </Text>

      <Card mode="elevated">
        <Card.Content style={styles.summary}>
          <View style={styles.row}>
            <Text variant="bodyMedium">Precio actual</Text>
            <Text variant="titleLarge" style={styles.price}>
              {formatCurrency(currentPrice)}
            </Text>
          </View>
          {auction.startingPrice != null ? (
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.muted}>
                Precio inicial
              </Text>
              <Text variant="bodySmall" style={styles.muted}>
                {formatCurrency(auction.startingPrice)}
              </Text>
            </View>
          ) : null}
          <View style={styles.chips}>
            <Chip icon="clock-outline">
              {ended ? 'Finalizada' : timeRemaining(auction.endsAt)}
            </Chip>
            {auction.totalBids != null ? (
              <Chip icon="gavel">{`${auction.totalBids} pujas`}</Chip>
            ) : null}
            {auction.status ? <Chip>{auction.status}</Chip> : null}
          </View>
          {auction.endsAt ? (
            <Text variant="bodySmall" style={styles.muted}>
              Termina: {formatDate(auction.endsAt)}
            </Text>
          ) : null}
          {ended && auction.winner ? (
            <Text variant="bodyMedium" style={styles.winner}>
              🏆 Ganador: {auction.winner.name}
            </Text>
          ) : null}
        </Card.Content>
      </Card>

      {ended ? (
        <Text variant="bodyMedium" style={styles.endedNote}>
          Esta subasta ya finalizó.
        </Text>
      ) : (
        <BidForm
          currentPrice={currentPrice}
          submitting={submitting}
          onSubmit={submitBid}
        />
      )}

      <Divider style={styles.divider} />
      <Text variant="titleMedium">Historial de pujas</Text>
      {bids.length === 0 ? (
        <Text variant="bodyMedium" style={styles.muted}>
          Aún no hay pujas. ¡Sé el primero!
        </Text>
      ) : (
        bids.map((bid) => (
          <List.Item
            key={String(bid.id)}
            title={formatCurrency(bid.amount)}
            description={bid.bidder?.name ?? formatDate(bid.placedAt)}
            left={(props) => <List.Icon {...props} icon="gavel" />}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  title: { fontWeight: '700' },
  summary: { gap: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { color: '#208AEF', fontWeight: '800' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  muted: { opacity: 0.7 },
  winner: { fontWeight: '700', marginTop: 4 },
  endedNote: { textAlign: 'center', opacity: 0.7, marginVertical: 8 },
  divider: { marginVertical: 8 },
});
