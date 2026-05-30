import { useEffect, useCallback, useRef } from 'react';

// Performance monitoring hook
export const usePerformance = (componentName: string) => {
  const renderStartTime = useRef(Date.now());

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    if (renderTime > 100) { // Log slow renders
      console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
    }
  });

  const measureAsync = useCallback(async (operation: () => Promise<any>, operationName: string) => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  return { measureAsync };
};

// Image lazy loading with intersection observer
export const useLazyImage = (ref: React.RefObject<HTMLImageElement>) => {
  useEffect(() => {
    const imageElement = ref.current;
    if (!imageElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageElement);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
};

import { useState } from 'react';

// Debounce hook for performance optimization
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};