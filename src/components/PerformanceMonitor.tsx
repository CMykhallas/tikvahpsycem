import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const lcp = lastEntry.startTime;
          
          analytics.track('core_web_vital', {
            metric: 'LCP',
            value: lcp,
            rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs_improvement' : 'poor'
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            const fid = entry.processingStart - entry.startTime;
            
            analytics.track('core_web_vital', {
              metric: 'FID',
              value: fid,
              rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs_improvement' : 'poor'
            });
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          analytics.track('core_web_vital', {
            metric: 'CLS',
            value: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs_improvement' : 'poor'
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    };

    // Monitor page load performance
    const monitorPageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp_connection: navigation.connectEnd - navigation.connectStart,
            request_response: navigation.responseEnd - navigation.requestStart,
            dom_processing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
            total_load_time: navigation.loadEventEnd - navigation.fetchStart
          };
          
          analytics.track('page_performance', {
            ...metrics,
            url: window.location.pathname,
            user_agent: navigator.userAgent,
            connection_type: (navigator as any).connection?.effectiveType || 'unknown'
          });
        }
      }
    };

    // Monitor resource loading
    const monitorResources = () => {
      if ('PerformanceObserver' in window) {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (entry.duration > 1000) { // Only track slow resources
              analytics.track('slow_resource', {
                name: entry.name,
                type: entry.initiatorType,
                duration: entry.duration,
                size: entry.transferSize || 0,
                url: window.location.pathname
              });
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
      }
    };

    // Monitor JavaScript errors
    const monitorErrors = () => {
      window.addEventListener('error', (event) => {
        analytics.track('javascript_error', {
          message: event.message,
          filename: event.filename,
          line: event.lineno,
          column: event.colno,
          url: window.location.pathname,
          user_agent: navigator.userAgent
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        analytics.track('promise_rejection', {
          reason: event.reason?.toString() || 'Unknown',
          url: window.location.pathname,
          user_agent: navigator.userAgent
        });
      });
    };

    // Monitor user interactions
    const monitorUserInteractions = () => {
      // Track clicks on important elements
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        
        // Track CTA clicks
        if (target.textContent?.includes('Agendar') || target.closest('[data-cta]')) {
          analytics.track('cta_click', {
            element: target.tagName.toLowerCase(),
            text: target.textContent?.trim(),
            url: window.location.pathname
          });
        }
        
        // Track navigation clicks
        if (target.closest('nav') || target.closest('[role="navigation"]')) {
          analytics.track('navigation_click', {
            text: target.textContent?.trim(),
            url: window.location.pathname,
            destination: (target as HTMLAnchorElement).href || 'unknown'
          });
        }
      });

      // Track scroll depth
      let maxScrollDepth = 0;
      const trackScrollDepth = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollDepth = (scrollTop / documentHeight) * 100;
        
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          
          // Track milestones
          const milestones = [25, 50, 75, 90, 100];
          const milestone = milestones.find(m => scrollDepth >= m && maxScrollDepth < m);
          
          if (milestone) {
            analytics.track('scroll_depth', {
              depth: milestone,
              url: window.location.pathname
            });
          }
        }
      };
      
      window.addEventListener('scroll', trackScrollDepth, { passive: true });
    };

    // Initialize all monitoring
    const initializeMonitoring = () => {
      observeWebVitals();
      monitorPageLoad();
      monitorResources();
      monitorErrors();
      monitorUserInteractions();
    };

    // Start monitoring after a delay to not impact initial load
    setTimeout(initializeMonitoring, 1000);

    // Track session duration
    const sessionStart = Date.now();
    
    const trackSessionEnd = () => {
      const sessionDuration = Date.now() - sessionStart;
      analytics.track('session_duration', {
        duration: sessionDuration,
        url: window.location.pathname,
        pages_viewed: 1 // This could be enhanced to track actual page views
      });
    };

    // Track session end on page unload
    window.addEventListener('beforeunload', trackSessionEnd);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', trackSessionEnd);
    };
  }, []);

  return null; // This component doesn't render anything
};