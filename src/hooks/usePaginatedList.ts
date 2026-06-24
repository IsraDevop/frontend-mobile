import { useCallback, useEffect, useRef, useState } from 'react';

import { PageResponse } from '@/types/api';
import { ApiError, getErrorMessage } from '@/utils/errors';

type LoadMode = 'initial' | 'refresh' | 'more';

export interface PaginatedListState<T> {
  items: T[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
}

/**
 * Drives an infinite, pull-to-refresh FlatList backed by a Spring-style
 * paginated endpoint. Cancels in-flight requests when deps change/unmount.
 */
export function usePaginatedList<T>(
  fetchPage: (page: number, signal: AbortSignal) => Promise<PageResponse<T>>,
  deps: unknown[] = [],
): PaginatedListState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(0);
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  const load = useCallback(
    async (page: number, mode: LoadMode, signal: AbortSignal) => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      setError(null);
      try {
        const res = await fetchRef.current(page, signal);
        const content = res.content ?? [];
        pageRef.current = page;
        setHasMore(res.last != null ? !res.last : content.length > 0);
        setItems((prev) => (mode === 'more' ? [...prev, ...content] : content));
      } catch (err) {
        if ((err as ApiError).code !== 'CANCELED') setError(getErrorMessage(err));
      } finally {
        if (!signal.aborted) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    pageRef.current = 0;
    load(0, 'initial', controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refresh = useCallback(() => {
    const controller = new AbortController();
    load(0, 'refresh', controller.signal);
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || refreshing || !hasMore) return;
    const controller = new AbortController();
    load(pageRef.current + 1, 'more', controller.signal);
  }, [load, loading, loadingMore, refreshing, hasMore]);

  return {
    items,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}
