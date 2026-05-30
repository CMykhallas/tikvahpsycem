
// Integration layer for all security utilities
import { 
  enhancedSecurityMonitor, 
  logAuthenticationFailure, 
  logSuspiciousActivity, 
  logRateLimitViolation 
} from './securityMonitoringEnhanced';
import { advancedThreatDetector, threatResponseSystem } from './advancedThreatDetection';
import { securityAuditor } from './securityAudit';
import { validateFormInput, rateLimiter, csrfToken } from './security';

// Comprehensive security check for all inputs
export const performSecurityCheck = (input: string, context: any = {}) => {
  // 1. Basic validation
  const validation = validateFormInput({ input });
  
  // 2. Advanced threat detection
  const threatAnalysis = advancedThreatDetector.analyzeThreat(input, context);
  
  // 3. Rate limiting check
  const isRateLimited = rateLimiter.check(
    context.ip || 'unknown', 
    context.limit || 10, 
    context.windowMs || 60000
  );
  
  // 4. CSRF validation (if token provided)
  const csrfValid = context.csrfToken ? csrfToken.validate(context.csrfToken) : true;
  
  // Combined security assessment
  const securityResult = {
    isValid: validation.isValid && !isRateLimited && csrfValid && threatAnalysis.threatLevel !== 'critical',
    validation,
    threatAnalysis,
    isRateLimited,
    csrfValid,
    errors: [
      ...validation.errors,
      ...(isRateLimited ? ['Rate limit exceeded'] : []),
      ...(csrfValid ? [] : ['Invalid CSRF token']),
      ...(threatAnalysis.threatLevel === 'critical' ? ['Critical security threat detected'] : [])
    ],
    riskScore: threatAnalysis.riskScore,
    recommendations: threatAnalysis.recommendations,
    threatResponse: undefined as any
  };
  
  // Log security events
  if (!securityResult.isValid) {
    logSuspiciousActivity('Security check failed', {
      input: input.slice(0, 50),
      errors: securityResult.errors,
      riskScore: securityResult.riskScore,
      context
    });
  }
  
  // Handle threat response
  if (threatAnalysis.threatLevel !== 'none') {
    const response = threatResponseSystem.handleThreat(threatAnalysis, context);
    securityResult.threatResponse = response;
  }
  
  return securityResult;
};

// Enhanced authentication security
export const enhancedAuthSecurity = {
  validateLogin: (email: string, password: string, context: any = {}) => {
    const securityCheck = performSecurityCheck(email + password, {
      ...context,
      type: 'authentication',
      limit: 5,
      windowMs: 300000 // 5 minutes
    });
    
    if (!securityCheck.isValid) {
      logAuthenticationFailure({
        email: email.slice(0, 3) + '***',
        errors: securityCheck.errors,
        riskScore: securityCheck.riskScore,
        ip: context.ip
      });
    }
    
    return securityCheck;
  },
  
  trackFailedLogin: (email: string, context: any = {}) => {
    logAuthenticationFailure({
      email: email.slice(0, 3) + '***',
      reason: 'Invalid credentials',
      ip: context.ip,
      timestamp: Date.now()
    });
    
    // Check for brute force patterns
    const analysis = advancedThreatDetector.analyzeThreat('failed_login', {
      ...context,
      email
    });
    
    if (analysis.riskScore > 50) {
      logSuspiciousActivity('Potential brute force attack', {
        email: email.slice(0, 3) + '***',
        attempts: analysis.riskScore,
        ip: context.ip
      }, 'high');
    }
  }
};

// Form security wrapper
export const secureFormSubmission = async (
  formData: any, 
  submitFunction: (data: any) => Promise<any>,
  context: any = {}
) => {
  try {
    // Generate CSRF token if not present
    if (!context.csrfToken) {
      context.csrfToken = csrfToken.generate();
    }
    
    // Perform comprehensive security check
    const securityCheck = performSecurityCheck(JSON.stringify(formData), context);
    
    if (!securityCheck.isValid) {
      throw new Error(`Security check failed: ${securityCheck.errors.join(', ')}`);
    }
    
    // If high risk but not critical, add additional verification
    if (securityCheck.riskScore > 25) {
      enhancedSecurityMonitor.logSecurityEvent({
        severity: 'medium',
        category: 'input_validation',
        event: 'High-risk form submission',
        details: {
          riskScore: securityCheck.riskScore,
          threats: securityCheck.threatAnalysis.detectedThreats
        }
      });
    }
    
    // Submit with security context
    const result = await submitFunction({
      ...formData,
      _security: {
        csrfToken: context.csrfToken,
        timestamp: Date.now(),
        verified: true
      }
    });
    
    // Log successful submission
    enhancedSecurityMonitor.logSecurityEvent({
      severity: 'low',
      category: 'system',
      event: 'Secure form submission completed',
      details: { formType: context.formType || 'unknown' }
    });
    
    return { success: true, data: result };
    
  } catch (error) {
    // Log failed submission
    logSuspiciousActivity('Form submission failed', {
      error: error.message,
      formType: context.formType,
      ip: context.ip
    });
    
    return { success: false, error: error.message };
  }
};

// Automated security maintenance
export const securityMaintenance = {
  runDailyChecks: async () => {
    console.log('Running daily security checks...');
    
    // 1. Run security audit
    const auditResult = await securityAuditor.runFullAudit();
    
    // 2. Clear old threat history
    advancedThreatDetector.clearThreatHistory(86400000); // 24 hours
    
    // 3. Clean up rate limiting store
    rateLimiter.cleanup();
    
    // 4. Log maintenance completion
    enhancedSecurityMonitor.logSecurityEvent({
      severity: 'low',
      category: 'system',
      event: 'Daily security maintenance completed',
      details: {
        auditScore: auditResult.score,
        auditGrade: auditResult.grade,
        threatsCleared: 'unknown',
        rateLimitEntriesCleared: 'unknown'
      }
    });
    
    return auditResult;
  },
  
  runWeeklyDeepScan: async () => {
    console.log('Running weekly deep security scan...');
    
    // 1. Comprehensive audit
    const auditResult = await securityAuditor.runFullAudit();
    
    // 2. Analyze threat patterns
    const threatHistory = advancedThreatDetector.getThreatHistory();
    const patterns = threatHistory.reduce((acc, threat) => {
      const key = threat.key.split('_')[0];
      acc[key] = (acc[key] || 0) + threat.count;
      return acc;
    }, {} as Record<string, number>);
    
    // 3. Generate security report
    const report = {
      timestamp: new Date().toISOString(),
      auditResult,
      threatPatterns: patterns,
      recommendations: [
        ...auditResult.recommendations,
        'Review threat patterns for recurring issues',
        'Update security policies based on findings',
        'Consider additional security measures for high-risk areas'
      ]
    };
    
    // 4. Log weekly report
    enhancedSecurityMonitor.logSecurityEvent({
      severity: 'low',
      category: 'system',
      event: 'Weekly security deep scan completed',
      details: report
    });
    
    return report;
  }
};

// Initialize security monitoring
if (typeof window !== 'undefined') {
  // Run daily checks every 24 hours
  setInterval(() => {
    securityMaintenance.runDailyChecks();
  }, 86400000);
  
  // Run weekly deep scan every 7 days
  setInterval(() => {
    securityMaintenance.runWeeklyDeepScan();
  }, 604800000);
}

export {
  enhancedSecurityMonitor,
  advancedThreatDetector,
  threatResponseSystem,
  securityAuditor
};
