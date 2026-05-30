
// Enhanced security monitoring with structured logging and alerting
export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'input_validation' | 'rate_limiting' | 'suspicious_activity' | 'system';
  event: string;
  details: Record<string, any>;
  ip?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

export interface SecurityMetrics {
  failedLogins: number;
  suspiciousActivities: number;
  blockedIPs: Set<string>;
  rateLimitViolations: number;
  lastReset: number;
}

class EnhancedSecurityMonitor {
  private events: SecurityEvent[] = [];
  private metrics: SecurityMetrics = {
    failedLogins: 0,
    suspiciousActivities: 0,
    blockedIPs: new Set(),
    rateLimitViolations: 0,
    lastReset: Date.now()
  };
  private maxEvents = 1000;
  private alertThresholds = {
    failedLogins: 10,
    suspiciousActivities: 5,
    rateLimitViolations: 20
  };

  logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event,
      ip: event.ip || this.getClientIP(),
      userAgent: event.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'server'),
      url: event.url || (typeof window !== 'undefined' ? window.location.href : 'server')
    };

    this.events.push(securityEvent);
    
    // Maintain event log size
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Update metrics
    this.updateMetrics(securityEvent);

    // Log to console with structured format
    const logLevel = this.getLogLevel(securityEvent.severity);
    console[logLevel](`[SECURITY EVENT] ${securityEvent.severity.toUpperCase()}:`, {
      event: securityEvent.event,
      category: securityEvent.category,
      details: securityEvent.details,
      timestamp: securityEvent.timestamp,
      ip: securityEvent.ip
    });

    // Check for alert conditions
    this.checkAlertConditions(securityEvent);
  }

  private updateMetrics(event: SecurityEvent): void {
    switch (event.category) {
      case 'authentication':
        if (event.event.includes('failed') || event.event.includes('invalid')) {
          this.metrics.failedLogins++;
        }
        break;
      case 'suspicious_activity':
        this.metrics.suspiciousActivities++;
        break;
      case 'rate_limiting':
        this.metrics.rateLimitViolations++;
        if (event.ip) {
          this.metrics.blockedIPs.add(event.ip);
        }
        break;
    }
  }

  private checkAlertConditions(event: SecurityEvent): void {
    // Reset metrics every hour
    const now = Date.now();
    if (now - this.metrics.lastReset > 3600000) {
      this.resetMetrics();
    }

    // Check thresholds and trigger alerts
    if (this.metrics.failedLogins >= this.alertThresholds.failedLogins) {
      this.triggerAlert('HIGH_FAILED_LOGINS', {
        count: this.metrics.failedLogins,
        timeWindow: '1 hour'
      });
    }

    if (this.metrics.suspiciousActivities >= this.alertThresholds.suspiciousActivities) {
      this.triggerAlert('HIGH_SUSPICIOUS_ACTIVITY', {
        count: this.metrics.suspiciousActivities,
        timeWindow: '1 hour'
      });
    }

    if (this.metrics.rateLimitViolations >= this.alertThresholds.rateLimitViolations) {
      this.triggerAlert('HIGH_RATE_LIMIT_VIOLATIONS', {
        count: this.metrics.rateLimitViolations,
        blockedIPs: Array.from(this.metrics.blockedIPs),
        timeWindow: '1 hour'
      });
    }
  }

  private triggerAlert(alertType: string, details: Record<string, any>): void {
    console.error(`[SECURITY ALERT] ${alertType}:`, details);
    
    // In production, this would integrate with alerting systems
    // Example: send to monitoring service, email, Slack, etc.
    if (typeof window !== 'undefined') {
      // Client-side alert (for development)
      console.warn(`Security Alert: ${alertType}`, details);
    }
  }

  private resetMetrics(): void {
    this.metrics = {
      failedLogins: 0,
      suspiciousActivities: 0,
      blockedIPs: new Set(),
      rateLimitViolations: 0,
      lastReset: Date.now()
    };
  }

  private getLogLevel(severity: SecurityEvent['severity']): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'low': return 'log';
      case 'medium': return 'warn';
      case 'high':
      case 'critical': return 'error';
      default: return 'warn';
    }
  }

  private getClientIP(): string {
    if (typeof window !== 'undefined') {
      return 'client_' + Date.now();
    }
    return 'unknown';
  }

  // Public methods for external use
  getSecurityMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  getEventsByCategory(category: SecurityEvent['category']): SecurityEvent[] {
    return this.events.filter(event => event.category === category);
  }

  isIPBlocked(ip: string): boolean {
    return this.metrics.blockedIPs.has(ip);
  }
}

// Export singleton instance
export const enhancedSecurityMonitor = new EnhancedSecurityMonitor();

// Convenience functions for common security events
export const logAuthenticationFailure = (details: Record<string, any>) => {
  enhancedSecurityMonitor.logSecurityEvent({
    severity: 'medium',
    category: 'authentication',
    event: 'Authentication failure',
    details
  });
};

export const logSuspiciousActivity = (event: string, details: Record<string, any>, severity: SecurityEvent['severity'] = 'medium') => {
  enhancedSecurityMonitor.logSecurityEvent({
    severity,
    category: 'suspicious_activity',
    event,
    details
  });
};

export const logRateLimitViolation = (details: Record<string, any>) => {
  enhancedSecurityMonitor.logSecurityEvent({
    severity: 'high',
    category: 'rate_limiting',
    event: 'Rate limit exceeded',
    details
  });
};

export const logInputValidationFailure = (details: Record<string, any>) => {
  enhancedSecurityMonitor.logSecurityEvent({
    severity: 'medium',
    category: 'input_validation',
    event: 'Input validation failure',
    details
  });
};
