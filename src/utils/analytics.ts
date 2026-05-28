// Advanced analytics and performance monitoring

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId: string | null = null;
  private events: AnalyticsEvent[] = [];
  private metrics: PerformanceMetric[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceMonitoring();
  }

  // CORREÇÃO ALERTA #4: Substituição do Math.random() por criptografia segura (UUIDv4)
  private generateSessionId(): string {
    if (typeof crypto !== 'undefined') {
      if (typeof crypto.randomUUID === 'function') {
        return `session_${crypto.randomUUID()}`;
      }
      // Fallback seguro usando getRandomValues caso randomUUID não esteja ativo
      const typedArray = new Uint8Array(16);
      crypto.getRandomValues(typedArray);
      const hexString = Array.from(typedArray, num => num.toString(16).padStart(2, '0')).join('');
      return `session_${hexString}`;
    }
    // Fallback de contingência para ambientes legados sem suporte a Crypto
    return `session_${Date.now()}_${String(Date.now() % 100000)}`;
  }

  private initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.observePerformance();
    
    // Monitor navigation timing
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => this.captureNavigationTiming(), 0);
      });
    }
  }

  private observePerformance() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('LCP', entry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('FID', (entry as any).processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private captureNavigationTiming() {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.recordMetric('TTFB', navigation.responseStart - navigation.requestStart);
      this.recordMetric('DOM_LOAD', navigation.domContentLoadedEventEnd - navigation.fetchStart);
      this.recordMetric('LOAD_COMPLETE', navigation.loadEventEnd - navigation.fetchStart);
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    this.metrics.push(metric);
    this.sendMetric(metric);
  }

  private async sendEvent(event: AnalyticsEvent) {
    // In a real application, send to your analytics service
    console.log('Analytics Event:', event);
    
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, {
        custom_parameter_1: event.properties,
        session_id: event.sessionId,
        user_id: event.userId
      });
    }
  }

  private async sendMetric(metric: PerformanceMetric) {
    // In a real application, send to your monitoring service
    console.log('Performance Metric:', metric);
    
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        page_url: metric.url
      });
    }
  }

  // Page view tracking
  trackPageView(path: string, title?: string) {
    this.track('page_view', {
      page_path: path,
      page_title: title || document.title,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    });
  }

  // User interaction tracking
  trackClick(element: string, properties?: Record<string, any>) {
    this.track('click', {
      element,
      ...properties
    });
  }

  trackFormSubmit(formName: string, success: boolean, properties?: Record<string, any>) {
    this.track('form_submit', {
      form_name: formName,
      success,
      ...properties
    });
  }

  trackError(error: Error, context?: string) {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
  }

  // Business-specific tracking
  trackServiceInquiry(service: string, method: string) {
    this.track('service_inquiry', {
      service_type: service,
      contact_method: method
    });
  }

  trackAppointmentRequest(service: string, preferredDate?: string) {
    this.track('appointment_request', {
      service_type: service,
      preferred_date: preferredDate
    });
  }

  trackDownload(fileName: string, fileType: string) {
    this.track('file_download', {
      file_name: fileName,
      file_type: fileType
    });
  }

  // Get analytics data (for dashboard/reporting)
  getSessionData() {
    return {
      sessionId: this.sessionId,
      events: this.events,
      metrics: this.metrics,
      userId: this.userId
    };
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackServiceInquiry: analytics.trackServiceInquiry.bind(analytics),
    trackAppointmentRequest: analytics.trackAppointmentRequest.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics)
  };
};
