import { api } from '@/services/client';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { Order, PageResponse } from '@/types/api';

export async function createOrder(listingId: string | number): Promise<Order> {
  const { data } = await api.post<Order>('/orders', { listingId });
  return data;
}

export async function getOrder(
  id: string | number,
  signal?: AbortSignal,
): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`, { signal });
  return data;
}

export async function listMyOrders(
  page = 0,
  signal?: AbortSignal,
): Promise<PageResponse<Order>> {
  const { data } = await api.get<PageResponse<Order>>('/orders/my-orders', {
    params: { page, size: DEFAULT_PAGE_SIZE },
    signal,
  });
  return data;
}

export async function confirmOrder(id: string | number): Promise<Order> {
  const { data } = await api.put<Order>(`/orders/${id}/confirm`);
  return data;
}

export async function cancelOrder(id: string | number): Promise<Order> {
  const { data } = await api.put<Order>(`/orders/${id}/cancel`);
  return data;
}
