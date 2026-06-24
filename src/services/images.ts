import { api } from '@/services/client';

export interface ImageAsset {
  uri: string;
  name?: string;
  type?: string;
}

/**
 * Uploads an image to a listing as multipart/form-data.
 * Axios sets the multipart boundary automatically for FormData.
 * Max 5 images per listing (enforced by the backend).
 */
export async function uploadListingImage(
  listingId: string | number,
  asset: ImageAsset,
  sortOrder?: number,
): Promise<unknown> {
  const form = new FormData();
  form.append('file', {
    uri: asset.uri,
    name: asset.name ?? `listing-${listingId}-${Date.now()}.jpg`,
    type: asset.type ?? 'image/jpeg',
  } as unknown as Blob);

  const { data } = await api.post(`/listings/${listingId}/images`, form, {
    params: sortOrder != null ? { sortOrder } : undefined,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
