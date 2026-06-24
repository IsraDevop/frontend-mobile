import { api } from '@/services/client';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import {
  Auction,
  AuctionSummary,
  CreateAuctionRequest,
  PageResponse,
} from '@/types/api';

export interface AuctionQuery {
  page?: number;
  size?: number;
  sort?: string;
}

/** Active auctions list returns lightweight summaries (id, currentPrice, endsAt, status). */
export async function listActiveAuctions(
  query: AuctionQuery = {},
  signal?: AbortSignal,
): Promise<PageResponse<AuctionSummary>> {
  const { data } = await api.get<PageResponse<AuctionSummary>>('/auctions', {
    params: { page: 0, size: DEFAULT_PAGE_SIZE, ...query },
    signal,
  });
  return data;
}

export async function getAuction(
  id: string | number,
  signal?: AbortSignal,
): Promise<Auction> {
  const { data } = await api.get<Auction>(`/auctions/${id}`, { signal });
  return data;
}

export async function createAuction(
  body: CreateAuctionRequest,
): Promise<Auction> {
  const { data } = await api.post<Auction>('/auctions', body);
  return data;
}
