import { api } from '@/services/client';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import {
  CreateListingRequest,
  Listing,
  PageResponse,
} from '@/types/api';

export interface ListingQuery {
  page?: number;
  size?: number;
  sort?: string;
  category?: string | number;
  mode?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}

export async function listListings(
  query: ListingQuery = {},
  signal?: AbortSignal,
): Promise<PageResponse<Listing>> {
  const { data } = await api.get<PageResponse<Listing>>('/listings', {
    params: { page: 0, size: DEFAULT_PAGE_SIZE, ...query },
    signal,
  });
  return data;
}

export async function getListing(
  id: string | number,
  signal?: AbortSignal,
): Promise<Listing> {
  const { data } = await api.get<Listing>(`/listings/${id}`, { signal });
  return data;
}

export async function createListing(
  body: CreateListingRequest,
): Promise<Listing> {
  const { data } = await api.post<Listing>('/listings', body);
  return data;
}

export async function updateListing(
  id: string | number,
  body: Partial<CreateListingRequest>,
): Promise<Listing> {
  const { data } = await api.put<Listing>(`/listings/${id}`, body);
  return data;
}

export async function cancelListing(id: string | number): Promise<void> {
  await api.delete(`/listings/${id}`);
}
