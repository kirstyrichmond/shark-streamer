import { useCallback, useRef, useEffect } from "react";

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

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const handleScroll = useCallback((): void => {
    if (isLoading || !hasNextPage) return;

    const scrolledNearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;

    if (scrolledNearBottom) {
      loadMoreRef.current();
    }
  }, [isLoading, hasNextPage, threshold]);

  useEffect(() => {
    let timeoutId: number | null = null;

    const throttledScroll = (): void => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);
};
