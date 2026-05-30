
// Advanced threat detection and security analytics
export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  threshold: number;
  timeWindow: number; // in milliseconds
}

export interface ThreatAnalysis {
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  detectedThreats: string[];
  recommendations: string[];
  riskScore: number;
  timestamp: string;
}

class AdvancedThreatDetector {
  private patterns: ThreatPattern[] = [
    {
      id: 'sql_injection',
      name: 'SQL Injection Attempt',
      description: 'Potential SQL injection patterns detected',
      severity: 'critical',
      indicators: ['union select', 'drop table', '1=1', 'or 1=1', '-- ', 'xp_cmdshell'],
      threshold: 1,
      timeWindow: 300000 // 5 minutes
    },
    {
      id: 'xss_attempt',
      name: 'Cross-Site Scripting Attempt',
      description: 'Potential XSS attack patterns detected',
      severity: 'high',
      indicators: ['<script', 'javascript:', 'onerror=', 'onload=', 'eval('],
      threshold: 1,
      timeWindow: 300000
    },
    {
      id: 'brute_force',
      name: 'Brute Force Attack',
      description: 'Multiple failed authentication attempts',
      severity: 'high',
      indicators: ['failed_login'],
      threshold: 5,
      timeWindow: 300000
    },
    {
      id: 'data_exfiltration',
      name: 'Data Exfiltration Attempt',
      description: 'Suspicious data access patterns',
      severity: 'critical',
      indicators: ['bulk_select', 'rapid_queries', 'admin_bypass'],
      threshold: 3,
      timeWindow: 600000 // 10 minutes
    },
    {
      id: 'privilege_escalation',
      name: 'Privilege Escalation Attempt',
      description: 'Attempts to gain unauthorized access',
      severity: 'critical',
      indicators: ['role_manipulation', 'admin_attempt', 'unauthorized_access'],
      threshold: 2,
      timeWindow: 900000 // 15 minutes
    }
  ];

  private threatHistory: Map<string, { count: number; lastSeen: number; events: any[] }> = new Map();

  analyzeThreat(input: string, context: any = {}): ThreatAnalysis {
    const detectedThreats: string[] = [];
    let riskScore = 0;
    let maxSeverity: ThreatAnalysis['threatLevel'] = 'none';

    const inputLower = input.toLowerCase();

    // Pattern matching for known threats
    this.patterns.forEach(pattern => {
      const matches = pattern.indicators.filter(indicator => 
        inputLower.includes(indicator.toLowerCase())
      );

      if (matches.length >= pattern.threshold) {
        detectedThreats.push(pattern.name);
        
        // Update risk score based on severity
        const severityScores = { low: 10, medium: 25, high: 50, critical: 100 };
        riskScore += severityScores[pattern.severity];

        // Update max severity
        const severityLevels = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };
        if (severityLevels[pattern.severity] > severityLevels[maxSeverity]) {
          maxSeverity = pattern.severity;
        }

        // Track threat history
        const key = `${pattern.id}_${context.ip || 'unknown'}`;
        const existing = this.threatHistory.get(key) || { count: 0, lastSeen: 0, events: [] };
        existing.count++;
        existing.lastSeen = Date.now();
        existing.events.push({ input: input.slice(0, 100), context, timestamp: Date.now() });
        this.threatHistory.set(key, existing);
      }
    });

    // Behavioral analysis
    const behavioralThreats = this.analyzeBehavioralPatterns(context);
    detectedThreats.push(...behavioralThreats.threats);
    riskScore += behavioralThreats.riskScore;

    // Generate recommendations
    const recommendations = this.generateRecommendations(detectedThreats, riskScore, context);

    return {
      threatLevel: maxSeverity,
      detectedThreats,
      recommendations,
      riskScore: Math.min(riskScore, 100), // Cap at 100
      timestamp: new Date().toISOString()
    };
  }

  private analyzeBehavioralPatterns(context: any): { threats: string[]; riskScore: number } {
    const threats: string[] = [];
    let riskScore = 0;

    // Check for rapid requests from same IP
    if (context.ip) {
      const recentActivity = Array.from(this.threatHistory.entries())
        .filter(([key, data]) => key.includes(context.ip) && Date.now() - data.lastSeen < 60000)
        .reduce((sum, [, data]) => sum + data.count, 0);

      if (recentActivity > 20) {
        threats.push('Rapid Request Pattern');
        riskScore += 30;
      }
    }

    // Check for suspicious user agent patterns
    if (context.userAgent) {
      const suspiciousAgents = ['bot', 'crawler', 'scanner', 'sqlmap', 'nmap'];
      if (suspiciousAgents.some(agent => context.userAgent.toLowerCase().includes(agent))) {
        threats.push('Suspicious User Agent');
        riskScore += 20;
      }
    }

    // Check for unusual request patterns
    if (context.path && context.method) {
      const adminPaths = ['/admin', '/dashboard', '/api/admin', '/management'];
      if (adminPaths.some(path => context.path.includes(path)) && context.method === 'GET') {
        threats.push('Admin Area Reconnaissance');
        riskScore += 15;
      }
    }

    return { threats, riskScore };
  }

  private generateRecommendations(threats: string[], riskScore: number, context: any): string[] {
    const recommendations: string[] = [];

    if (riskScore > 75) {
      recommendations.push('IMMEDIATE ACTION: Block IP address and escalate to security team');
      recommendations.push('Enable enhanced monitoring for this session');
    } else if (riskScore > 50) {
      recommendations.push('Increase rate limiting for this IP');
      recommendations.push('Enable additional authentication checks');
    } else if (riskScore > 25) {
      recommendations.push('Monitor this session closely');
      recommendations.push('Log all activities for audit');
    }

    if (threats.includes('SQL Injection Attempt')) {
      recommendations.push('Review and strengthen input validation');
      recommendations.push('Consider implementing prepared statements');
    }

    if (threats.includes('Brute Force Attack')) {
      recommendations.push('Implement progressive delays for failed attempts');
      recommendations.push('Consider CAPTCHA verification');
    }

    if (threats.includes('Suspicious User Agent')) {
      recommendations.push('Block automated scanning tools');
      recommendations.push('Implement bot detection mechanisms');
    }

    return recommendations;
  }

  getThreatHistory(ip?: string): any[] {
    if (ip) {
      return Array.from(this.threatHistory.entries())
        .filter(([key]) => key.includes(ip))
        .map(([key, data]) => ({ key, ...data }));
    }
    return Array.from(this.threatHistory.entries()).map(([key, data]) => ({ key, ...data }));
  }

  clearThreatHistory(olderThan: number = 86400000): void { // 24 hours default
    const now = Date.now();
    for (const [key, data] of this.threatHistory.entries()) {
      if (now - data.lastSeen > olderThan) {
        this.threatHistory.delete(key);
      }
    }
  }
}

export const advancedThreatDetector = new AdvancedThreatDetector();

// Automated threat response system
export const threatResponseSystem = {
  handleThreat: (analysis: ThreatAnalysis, context: any) => {
    console.warn('[THREAT DETECTED]', {
      level: analysis.threatLevel,
      threats: analysis.detectedThreats,
      riskScore: analysis.riskScore,
      context: { ip: context.ip, userAgent: context.userAgent?.slice(0, 50) }
    });

    // Automatic response based on threat level
    if (analysis.threatLevel === 'critical' && analysis.riskScore > 75) {
      // Critical threat - implement immediate countermeasures
      console.error('[CRITICAL THREAT] Implementing emergency security measures');
      return {
        action: 'block',
        message: 'Security threat detected. Access temporarily restricted.',
        escalate: true
      };
    } else if (analysis.threatLevel === 'high' && analysis.riskScore > 50) {
      // High threat - enhanced security measures
      console.warn('[HIGH THREAT] Enabling enhanced security measures');
      return {
        action: 'challenge',
        message: 'Additional verification required for security.',
        escalate: false
      };
    } else if (analysis.riskScore > 25) {
      // Medium threat - monitoring
      console.info('[MEDIUM THREAT] Enhanced monitoring enabled');
      return {
        action: 'monitor',
        message: null,
        escalate: false
      };
    }

    return { action: 'none', message: null, escalate: false };
  }
};
