import { api } from '@/services/client';
import { Category, PageResponse } from '@/types/api';

/** Categories may come back as a plain array or a paginated wrapper. */
export async function listCategories(signal?: AbortSignal): Promise<Category[]> {
  const { data } = await api.get<Category[] | PageResponse<Category>>(
    '/categories',
    { signal },
  );
  if (Array.isArray(data)) return data;
  return data.content ?? [];
}
