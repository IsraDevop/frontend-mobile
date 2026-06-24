import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';

import { Listing } from '@/types/api';
import { formatCurrency } from '@/utils/currency';
import { listingCover, listingPrice } from '@/utils/listing';

interface Props {
  listing: Listing;
  onPress: () => void;
}

export function ListingCard({ listing, onPress }: Props) {
  const uri = listingCover(listing);
  const isAuction = listing.mode === 'AUCTION';
  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      {uri ? <Card.Cover source={{ uri }} style={styles.cover} /> : null}
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={1}>
          {listing.title}
        </Text>
        <Text variant="titleSmall" style={styles.price}>
          {formatCurrency(listingPrice(listing))}
        </Text>
        <View style={styles.row}>
          <Chip compact icon={isAuction ? 'gavel' : 'tag'}>
            {isAuction ? 'Subasta' : 'Venta'}
          </Chip>
          {listing.condition ? (
            <Chip compact>{listing.condition}</Chip>
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
