import { Listing, ListingMode } from '@/types/api';

/** First image URL of a listing, if any. */
export function listingCover(listing: Listing): string | undefined {
  return listing.imageUrls?.[0];
}

/** Display price: fixed price for direct sales, current bid for auctions. */
export function listingPrice(listing: Listing): number | undefined {
  return listing.fixedPrice ?? listing.auction?.currentPrice;
}

export function modeLabel(mode: ListingMode): string {
  return mode === 'AUCTION' ? 'Subasta' : 'Venta directa';
}
