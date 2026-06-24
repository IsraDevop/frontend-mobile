import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';

import { AuctionSummary } from '@/types/api';
import { formatCurrency, timeRemaining } from '@/utils/currency';

interface Props {
  auction: AuctionSummary;
  onPress: () => void;
}

/** Active-auction lists return only summary fields (id, currentPrice, endsAt, status). */
export function AuctionCard({ auction, onPress }: Props) {
  const ended = auction.status !== 'ACTIVE' || timeRemaining(auction.endsAt) === 'Finalizada';
  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content style={styles.content}>
        <Text variant="titleMedium">{`Subasta #${auction.id}`}</Text>
        <Text variant="titleSmall" style={styles.price}>
          {formatCurrency(auction.currentPrice)}
        </Text>
        <View style={styles.row}>
          <Chip compact icon="clock-outline">
            {ended ? 'Finalizada' : timeRemaining(auction.endsAt) || 'Activa'}
          </Chip>
          {auction.status ? <Chip compact>{auction.status}</Chip> : null}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  content: { gap: 4 },
  price: { fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
});
