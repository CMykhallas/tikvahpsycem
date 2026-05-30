
import { useState, useEffect, useCallback } from 'react';
import { enhancedSecurityMonitor, SecurityEvent } from '@/utils/securityMonitoringEnhanced';
import { advancedThreatDetector, ThreatAnalysis } from '@/utils/advancedThreatDetection';
import { securityAuditor, SecurityAuditResult } from '@/utils/securityAudit';

export const useSecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysis | null>(null);
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load security events
  useEffect(() => {
    const loadEvents = () => {
      const events = enhancedSecurityMonitor.getRecentEvents(50);
      setSecurityEvents(events);
    };

    loadEvents();
    
    // Refresh events every 30 seconds
    const interval = setInterval(loadEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  // Analyze threat in real-time
  const analyzeInput = useCallback((input: string, context: any = {}) => {
    const analysis = advancedThreatDetector.analyzeThreat(input, {
      ip: context.ip || 'unknown',
      userAgent: context.userAgent || navigator.userAgent,
      timestamp: Date.now(),
      ...context
    });

    setThreatAnalysis(analysis);

    // Log high-risk threats
    if (analysis.riskScore > 50) {
      enhancedSecurityMonitor.logSecurityEvent({
        severity: analysis.threatLevel === 'critical' ? 'critical' : 'high',
        category: 'suspicious_activity',
        event: 'High-risk threat detected',
        details: {
          threats: analysis.detectedThreats,
          riskScore: analysis.riskScore,
          input: input.slice(0, 100)
        }
      });
    }

    return analysis;
  }, []);

  // Run security audit
  const runSecurityAudit = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await securityAuditor.runFullAudit();
      setAuditResult(result);
      
      // Log audit results
      enhancedSecurityMonitor.logSecurityEvent({
        severity: result.grade.startsWith('A') ? 'low' : 'medium',
        category: 'system',
        event: 'Security audit completed',
        details: {
          score: result.score,
          grade: result.grade,
          passed: result.passed,
          failed: result.failed,
          critical: result.critical
        }
      });
      
      return result;
    } catch (error) {
      console.error('Security audit failed:', error);
      
      enhancedSecurityMonitor.logSecurityEvent({
        severity: 'high',
        category: 'system',
        event: 'Security audit failed',
        details: { error: error.message }
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get security metrics
  const getMetrics = useCallback(() => {
    return enhancedSecurityMonitor.getSecurityMetrics();
  }, []);

  // Log security event
  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    enhancedSecurityMonitor.logSecurityEvent(event);
    
    // Refresh events list
    const events = enhancedSecurityMonitor.getRecentEvents(50);
    setSecurityEvents(events);
  }, []);

  // Get threat history
  const getThreatHistory = useCallback((ip?: string) => {
    return advancedThreatDetector.getThreatHistory(ip);
  }, []);

  // Clear threat history
  const clearThreatHistory = useCallback((olderThan?: number) => {
    advancedThreatDetector.clearThreatHistory(olderThan);
  }, []);

  return {
    // State
    securityEvents,
    threatAnalysis,
    auditResult,
    isLoading,
    
    // Methods
    analyzeInput,
    runSecurityAudit,
    getMetrics,
    logSecurityEvent,
    getThreatHistory,
    clearThreatHistory
  };
};
