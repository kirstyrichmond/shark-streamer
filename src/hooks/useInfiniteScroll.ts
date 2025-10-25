import { useCallback, useRef, useEffect } from 'react';

interface InfiniteScrollOptions {
  hasNextPage: boolean;
  isLoading: boolean;
  threshold?: number;
}

type LoadMoreFunction = () => void;

export const useInfiniteScroll = (
  loadMore: LoadMoreFunction,
  { hasNextPage, isLoading, threshold = 1000 }: InfiniteScrollOptions
): void => {
  const loadMoreRef = useRef<LoadMoreFunction>(loadMore);
  loadMoreRef.current = loadMore;

  const handleScroll = useCallback((): void => {
    if (isLoading || !hasNextPage) return;

    const scrolledNearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - threshold;

    if (scrolledNearBottom) {
      loadMoreRef.current();
    }
  }, [isLoading, hasNextPage, threshold]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const throttledScroll = (): void => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);
};