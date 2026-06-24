import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';

import { Listing } from '@/types/api';
import { formatCurrency } from '@/utils/currency';

interface Props {
  listing: Listing;
  onPress: () => void;
}

function imageUri(listing: Listing): string | undefined {
  return listing.imageUrl ?? listing.images?.[0]?.url;
}

export function ListingCard({ listing, onPress }: Props) {
  const uri = imageUri(listing);
  const isAuction = listing.mode === 'AUCTION';
  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      {uri ? <Card.Cover source={{ uri }} style={styles.cover} /> : null}
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={1}>
          {listing.title}
        </Text>
        <Text variant="titleSmall" style={styles.price}>
          {formatCurrency(listing.price)}
        </Text>
        <View style={styles.row}>
          {listing.mode ? (
            <Chip compact icon={isAuction ? 'gavel' : 'tag'}>
              {isAuction ? 'Subasta' : 'Venta'}
            </Chip>
          ) : null}
          {listing.condition ? <Chip compact>{listing.condition}</Chip> : null}
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
