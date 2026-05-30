// Enhanced security utilities for the application
import { 
  sanitizeInputAdvanced, 
  validateEmailAdvanced, 
  securityMonitor, 
  defaultSecurityConfig,
  getClientIP 
} from './securityEnhancements'
import { 
  enhancedSecurityMonitor, 
  logAuthenticationFailure, 
  logSuspiciousActivity, 
  logRateLimitViolation, 
  logInputValidationFailure 
} from './securityMonitoringEnhanced'

export const sanitizeInput = (input: string): string => {
  return sanitizeInputAdvanced(input, 1000)
}

export const validateEmail = (email: string): boolean => {
  return validateEmailAdvanced(email).isValid
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/
  return phoneRegex.test(phone) && !phone.includes('<') && !phone.includes('>')
}

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{1,100}$/
  return nameRegex.test(name) && name.length <= 100
}

export const generateCSRFToken = (): string => {
  return crypto.randomUUID()
}

export const isValidURL = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

// Enhanced rate limiting with IP tracking and blocking
export const rateLimiter = {
  store: new Map<string, { count: number; resetTime: number; blocked: boolean; firstAttempt: number }>(),
  
  check: (key: string, limit: number = 10, windowMs: number = 60000): boolean => {
    const now = Date.now()
    const record = rateLimiter.store.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimiter.store.set(key, { 
        count: 1, 
        resetTime: now + windowMs, 
        blocked: false,
        firstAttempt: now
      })
      return false
    }
    
    if (record.count >= limit) {
      record.blocked = true
      
      // Enhanced logging for repeated violations
      logRateLimitViolation({
        key,
        attempts: record.count,
        timeWindow: windowMs,
        timeElapsed: now - record.firstAttempt
      });
      
      return true
    }
    
    record.count++
    return false
  },

  isBlocked: (key: string): boolean => {
    const record = rateLimiter.store.get(key)
    return record?.blocked || false
  },

  // Clean up old entries periodically
  cleanup: () => {
    const now = Date.now()
    let cleanedCount = 0
    for (const [key, record] of rateLimiter.store.entries()) {
      if (now > record.resetTime + 300000) { // Clean up entries older than 5 minutes past reset
        rateLimiter.store.delete(key)
        cleanedCount++
      }
    }
    
    if (cleanedCount > 0) {
      enhancedSecurityMonitor.logSecurityEvent({
        severity: 'low',
        category: 'system',
        event: 'Rate limiter cleanup',
        details: { cleanedEntries: cleanedCount }
      });
    }
  }
}

// CSRF token management with enhanced security
export const csrfToken = {
  generate: (): string => {
    const token = generateCSRFToken()
    sessionStorage.setItem('csrf-token', token)
    sessionStorage.setItem('csrf-timestamp', Date.now().toString())
    
    enhancedSecurityMonitor.logSecurityEvent({
      severity: 'low',
      category: 'system',
      event: 'CSRF token generated',
      details: { tokenLength: token.length }
    });
    
    return token
  },

  validate: (token: string): boolean => {
    const stored = sessionStorage.getItem('csrf-token')
    const timestamp = sessionStorage.getItem('csrf-timestamp')
    
    if (!stored || !timestamp) {
      logSuspiciousActivity('CSRF token validation failed - missing token', {
        hasStored: !!stored,
        hasTimestamp: !!timestamp
      });
      return false
    }
    
    // Check token expiry (30 minutes)
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > 1800000) {
      logSuspiciousActivity('CSRF token expired', {
        tokenAge: tokenAge,
        maxAge: 1800000
      });
      csrfToken.refresh()
      return false
    }
    
    const isValid = stored === token && token.length > 0
    if (!isValid) {
      logSuspiciousActivity('CSRF token validation failed - token mismatch', {
        tokenLength: token.length,
        storedLength: stored.length
      });
    }
    
    return isValid
  },

  refresh: (): string => {
    return csrfToken.generate()
  },

  get: (): string | null => {
    const token = sessionStorage.getItem('csrf-token')
    const timestamp = sessionStorage.getItem('csrf-timestamp')
    
    if (!token || !timestamp) return null
    
    // Auto-refresh if token is older than 25 minutes
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > 1500000) {
      return csrfToken.refresh()
    }
    
    return token
  }
}

// Enhanced form validation with security monitoring
export const validateFormInput = (data: Record<string, any>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  let securityIssuesFound = 0

  // Enhanced email validation
  if (data.email) {
    const emailValidation = validateEmailAdvanced(data.email)
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error || 'Invalid email format')
      logInputValidationFailure({
        field: 'email',
        value: data.email.slice(0, 10) + '...',
        error: emailValidation.error
      });
      securityIssuesFound++
    }
  }

  // Enhanced phone validation
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format')
    logInputValidationFailure({
      field: 'phone',
      value: data.phone.slice(0, 5) + '...'
    });
    securityIssuesFound++
  }

  // Enhanced name validation
  if (data.name && !validateName(data.name)) {
    errors.push('Invalid name format')
    logInputValidationFailure({
      field: 'name',
      value: data.name.slice(0, 10) + '...'
    });
    securityIssuesFound++
  }

  // Sanitize text inputs with monitoring
  const textFields = ['name', 'subject', 'message', 'client_name']
  textFields.forEach(field => {
    if (data[field]) {
      const original = data[field]
      data[field] = sanitizeInput(data[field])
      
      // Track if sanitization changed the input
      if (original !== data[field]) {
        logSuspiciousActivity('Input sanitization applied', {
          field,
          originalLength: original.length,
          sanitizedLength: data[field].length,
          changesMade: true
        });
        securityIssuesFound++
      }
    }
  })

  // Log overall validation results
  if (securityIssuesFound > 0) {
    logSuspiciousActivity('Form validation completed with issues', {
      totalIssues: securityIssuesFound,
      errorCount: errors.length,
      fieldsValidated: Object.keys(data)
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Enhanced security logging with structured data
export const securityLog = {
  logSuspiciousActivity: (activity: string, details: any = {}) => {
    logSuspiciousActivity(activity, details, 'medium');
  },

  logFailedAttempt: (type: 'login' | 'form_submission' | 'rate_limit', details: any = {}) => {
    switch (type) {
      case 'login':
        logAuthenticationFailure(details);
        break;
      case 'rate_limit':
        logRateLimitViolation(details);
        break;
      default:
        logInputValidationFailure(details);
    }
  }
}

// Keep existing rateLimit for backward compatibility
export const rateLimit = {
  store: new Map<string, { count: number; resetTime: number }>(),
  
  check: (key: string, limit: number = 10, windowMs: number = 60000): boolean => {
    return rateLimiter.check(key, limit, windowMs)
  }
}

// Periodic cleanup of rate limiting store with enhanced monitoring
if (typeof window !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup()
  }, 300000) // Clean up every 5 minutes
}
