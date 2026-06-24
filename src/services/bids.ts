import { api } from '@/services/client';
import { Bid, PageResponse, PlaceBidRequest } from '@/types/api';

/** Places a bid. `amount` must be strictly greater than the current price. */
export async function placeBid(body: PlaceBidRequest): Promise<Bid> {
  const { data } = await api.post<Bid>('/bids', body);
  return data;
}

export async function listBids(
  auctionId: string | number,
  signal?: AbortSignal,
): Promise<PageResponse<Bid>> {
  const { data } = await api.get<PageResponse<Bid>>(
    `/bids/auction/${auctionId}`,
    { signal },
  );
  return data;
}

export async function getHighestBid(
  auctionId: string | number,
  signal?: AbortSignal,
): Promise<Bid> {
  const { data } = await api.get<Bid>(
    `/bids/auction/${auctionId}/highest`,
    { signal },
  );
  return data;
}
