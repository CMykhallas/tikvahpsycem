#!/usr/bin/env node

/**
 * ELITE SECURITY VERIFICATION SCRIPT
 * Quick check to ensure all components are in place
 */

const fs = require('fs');
const path = require('path');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';

console.log(`\n${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}`);
console.log(`${BLUE}║  🛡️  ELITE SECURITY SYSTEM - VERIFICATION CHECK           🛡️  ║${RESET}`);
console.log(`${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}\n`);

const files = [
  // Migrations
  {
    name: 'Honeypot Migration',
    path: 'supabase/migrations/20260206_elite_security_honeypots.sql',
    required: true
  },
  {
    name: 'WebAuthn Migration',
    path: 'supabase/migrations/20260206_webauthn_fido2.sql',
    required: true
  },
  
  // Utilities
  {
    name: 'Header Obfuscation',
    path: 'src/utils/headerObfuscation.ts',
    required: true
  },
  {
    name: 'WebAuthn Service',
    path: 'src/utils/webauthnService.ts',
    required: true
  },
  {
    name: 'Device Fingerprinting',
    path: 'src/utils/deviceFingerprinting.ts',
    required: true
  },
  {
    name: 'CSP & SRI',
    path: 'src/utils/cspAndSri.ts',
    required: true
  },
  {
    name: 'Incident Response Engine',
    path: 'src/utils/incidentResponseEngine.ts',
    required: true
  },
  {
    name: 'Elite Security Integration',
    path: 'src/utils/eliteSecurityIntegration.ts',
    required: true
  },
  
  // Documentation
  {
    name: 'Elite Security Roadmap',
    path: 'ELITE_SECURITY_ROADMAP.md',
    required: false
  },
  {
    name: 'Elite Security README',
    path: 'ELITE_SECURITY_README.md',
    required: false
  }
];

let passed = 0;
let failed = 0;

console.log(`${YELLOW}CHECKING FILES:${RESET}\n`);

for (const file of files) {
  const fullPath = path.join(process.cwd(), file.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const size = stats.size;
    const sizeStr = size > 1024 ? `${(size / 1024).toFixed(1)}KB` : `${size}B`;
    
    console.log(`${GREEN}✓${RESET} ${file.name} (${sizeStr})`);
    console.log(`  └─ ${file.path}`);
    passed++;
  } else {
    const status = file.required ? `${RED}✗${RESET}` : `${YELLOW}⚠${RESET}`;
    console.log(`${status} ${file.name}`);
    console.log(`  └─ ${file.path}`);
    if (file.required) failed++;
  }
  console.log('');
}

console.log(`${BLUE}════════════════════════════════════════════════════════════════${RESET}\n`);

console.log(`${YELLOW}VERIFICATION SUMMARY:${RESET}\n`);
console.log(`${GREEN}Passed:${RESET} ${passed}`);
console.log(`${RED}Failed:${RESET} ${failed}`);

if (failed === 0) {
  console.log(`\n${GREEN}✓ All critical files are present!${RESET}\n`);
  console.log(`${YELLOW}Next steps:${RESET}`);
  console.log(`1. Execute migrations: supabase migration up`);
  console.log(`2. Add to src/main.tsx: EliteSecuritySystem.initializeAllLayers();`);
  console.log(`3. Configure Slack webhook in src/utils/incidentResponseEngine.ts`);
  console.log(`4. Deploy to production`);
  console.log('');
  process.exit(0);
} else {
  console.log(`\n${RED}✗ Some critical files are missing!${RESET}\n`);
  console.log(`Please ensure all required files are present before deployment.`);
  console.log('');
  process.exit(1);
}
