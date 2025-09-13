import { useCallback, useRef, useEffect } from 'react';

export const useInfiniteScroll = (loadMore, { hasNextPage, isLoading, threshold = 1000 }) => {
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const handleScroll = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    
    const scrolledNearBottom = window.innerHeight + window.scrollY >= 
      document.documentElement.scrollHeight - threshold;
    
    if (scrolledNearBottom) {
      loadMoreRef.current();
    }
  }, [isLoading, hasNextPage, threshold]);

  useEffect(() => {
    let timeoutId;
    
    const throttledScroll = () => {
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