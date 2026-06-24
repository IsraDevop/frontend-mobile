import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';

import { Auction } from '@/types/api';
import { formatCurrency, timeRemaining } from '@/utils/currency';

interface Props {
  auction: Auction;
  onPress: () => void;
}

function auctionTitle(a: Auction): string {
  return a.title ?? a.listing?.title ?? `Subasta #${a.id}`;
}

function auctionImage(a: Auction): string | undefined {
  return a.imageUrl ?? a.listing?.imageUrl ?? a.listing?.images?.[0]?.url;
}

export function AuctionCard({ auction, onPress }: Props) {
  const uri = auctionImage(auction);
  const price = auction.currentPrice ?? auction.startingPrice;
  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      {uri ? <Card.Cover source={{ uri }} style={styles.cover} /> : null}
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={1}>
          {auctionTitle(auction)}
        </Text>
        <Text variant="titleSmall" style={styles.price}>
          {formatCurrency(price)}
        </Text>
        <View style={styles.row}>
          <Chip compact icon="clock-outline">
            {timeRemaining(auction.endsAt) || 'Activa'}
          </Chip>
          {auction.totalBids != null ? (
            <Chip compact icon="gavel">{`${auction.totalBids} pujas`}</Chip>
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  cover: { height: 160 },
  content: { paddingTop: 12, gap: 4 },
  price: { fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
});
