// Enterprise Security Configuration
export const ENTERPRISE_SECURITY_CONFIG = {
  // Advanced Password Security
  PASSWORD: {
    MIN_LENGTH: 16,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    REQUIRE_UNICODE: true,
    MAX_LENGTH: 128,
    HISTORY_SIZE: 5,
    COMPLEXITY_SCORE_MIN: 80,
    COMMON_PASSWORDS_BLOCKED: true,
    PWNED_PASSWORD_CHECK: true,
  },

  // Advanced JWT Security
  JWT: {
    ALGORITHM: 'RS256' as const,
    ACCESS_EXPIRY: '10m',
    REFRESH_EXPIRY: '7d',
    ROTATION_ENABLED: true,
    ROTATION_THRESHOLD: 0.8,
    BLACKLIST_ENABLED: true,
    FINGERPRINT_ENABLED: true,
  },

  // Advanced Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: {
      GENERAL: 100,
      AUTH: 3,
      API: 50,
      ADMIN: 20,
    },
    BURST_PROTECTION: true,
    PROGRESSIVE_BLOCKING: true,
    IP_WHITELIST: [] as string[],
    IP_BLACKLIST: [] as string[],
  },

  // Advanced Input Validation
  INPUT: {
    MAX_EMAIL_LENGTH: 254,
    MAX_NAME_LENGTH: 100,
    SANITIZE_HTML: true,
    DETECT_SQL_INJECTION: true,
    DETECT_XSS: true,
    VALIDATE_FILE_UPLOADS: true,
  },

  // Advanced File Security
  FILE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
    ] as const,
    ALLOWED_EXTENSIONS: [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.pdf',
      '.txt',
    ] as const,
    SCAN_VIRUSES: true,
    VALIDATE_CONTENT: true,
  },

  // Advanced MFA Security
  MFA: {
    REQUIRED_FOR_ADMIN: true,
    REQUIRED_ROLES: ['admin', 'seller'] as string[],
    REQUIRED_ACTIONS: [
      'password_change',
      'email_change',
      'mfa_disable',
      'admin_action',
      'payment',
      'sensitive_data_access',
    ] as string[],
    TOTP_ENABLED: true,
    SMS_ENABLED: true,
    EMAIL_ENABLED: true,
    RECOVERY_CODES_ENABLED: true,
    BACKUP_CODES_COUNT: 10,
  },

  // Advanced Security Headers
  SECURITY_HEADERS: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  },

  // Advanced Session Security
  SESSION: {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    RENEWAL_THRESHOLD: 0.5,
    MAX_CONCURRENT_SESSIONS: 5,
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    SECURE_COOKIES: true,
    HTTP_ONLY_COOKIES: true,
    SAME_SITE: 'strict' as const,
  },

  // Advanced CSRF Protection
  CSRF: {
    TOKEN_LENGTH: 32,
    TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
    DOUBLE_SUBMIT_COOKIE: true,
    CUSTOM_HEADER: 'X-CSRF-Token',
    REFRESH_ON_403: true,
  },

  // Advanced Audit Logging
  AUDIT: {
    LOG_LEVEL: 'info' as const,
    LOG_AUTH_ATTEMPTS: true,
    LOG_DATA_ACCESS: true,
    LOG_ADMIN_ACTIONS: true,
    LOG_SECURITY_VIOLATIONS: true,
    LOG_SUSPICIOUS_ACTIVITY: true,
    COMPLIANCE_TRACKING: {
      GDPR: true,
      SOX: true,
      HIPAA: false,
      PCI: false,
    },
  },

  // Advanced Threat Detection
  THREAT_DETECTION: {
    ENABLED: true,
    BEHAVIORAL_ANALYSIS: true,
    ANOMALY_DETECTION: true,
    GEO_BLOCKING: false,
    KNOWN_ATTACK_PATTERNS: true,
    MACHINE_LEARNING: false,
  },

  // Advanced Encryption
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm' as const,
    KEY_ROTATION_ENABLED: true,
    KEY_ROTATION_INTERVAL: 90 * 24 * 60 * 60 * 1000, // 90 days
    ENCRYPT_SENSITIVE_DATA: true,
    ENCRYPT_PII: true,
  },

  // Advanced Backup & Recovery
  BACKUP: {
    AUTO_BACKUP: true,
    BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
    RETENTION_DAYS: 30,
    ENCRYPT_BACKUPS: true,
    TEST_RESTORE: true,
  },

  // Advanced Monitoring
  MONITORING: {
    REAL_TIME_ALERTS: true,
    PERFORMANCE_MONITORING: true,
    ERROR_TRACKING: true,
    UPTIME_MONITORING: true,
    SECURITY_METRICS: true,
  },

  // Advanced Compliance
  COMPLIANCE: {
    GDPR: {
      ENABLED: true,
      DATA_RETENTION_DAYS: 2555, // 7 years
      RIGHT_TO_FORGOTTEN: true,
      DATA_PORTABILITY: true,
      CONSENT_MANAGEMENT: true,
    },
    SOX: {
      ENABLED: true,
      AUDIT_TRAIL: true,
      ACCESS_CONTROLS: true,
      CHANGE_MANAGEMENT: true,
    },
    HIPAA: {
      ENABLED: false,
      PHI_PROTECTION: false,
      ACCESS_LOGGING: false,
      ENCRYPTION_AT_REST: false,
    },
    PCI: {
      ENABLED: false,
      CARD_DATA_ENCRYPTION: false,
      TOKENIZATION: false,
      COMPLIANCE_REPORTING: false,
    },
  },

  // Advanced API Security
  API: {
    VERSIONING: true,
    RATE_LIMITING: true,
    AUTHENTICATION: true,
    AUTHORIZATION: true,
    INPUT_VALIDATION: true,
    OUTPUT_SANITIZATION: true,
    ERROR_HANDLING: true,
    DOCUMENTATION: true,
  },

  // Advanced Database Security
  DATABASE: {
    CONNECTION_ENCRYPTION: true,
    QUERY_PARAMETERIZATION: true,
    PRIVILEGE_ESCALATION_PROTECTION: true,
    AUDIT_LOGGING: true,
    BACKUP_ENCRYPTION: true,
    ACCESS_CONTROLS: true,
  },

  // Advanced Network Security
  NETWORK: {
    HTTPS_ONLY: true,
    HSTS_ENABLED: true,
    CORS_CONFIGURATION: true,
    PROXY_PROTECTION: true,
    DDoS_PROTECTION: true,
    FIREWALL_RULES: true,
  },

  // Advanced Development Security
  DEVELOPMENT: {
    CODE_SCANNING: true,
    DEPENDENCY_SCANNING: true,
    SECRET_SCANNING: true,
    CONTAINER_SCANNING: true,
    INFRASTRUCTURE_SCANNING: true,
  },
} as const

// Type definitions for better type safety
export type SecurityConfig = typeof ENTERPRISE_SECURITY_CONFIG
export type PasswordConfig = SecurityConfig['PASSWORD']
export type JWTConfig = SecurityConfig['JWT']
export type RateLimitConfig = SecurityConfig['RATE_LIMIT']
export type InputConfig = SecurityConfig['INPUT']
export type FileConfig = SecurityConfig['FILE']
export type MFAConfig = SecurityConfig['MFA']
export type SessionConfig = SecurityConfig['SESSION']
export type CSRFConfig = SecurityConfig['CSRF']
export type AuditConfig = SecurityConfig['AUDIT']
export type ThreatDetectionConfig = SecurityConfig['THREAT_DETECTION']
export type EncryptionConfig = SecurityConfig['ENCRYPTION']
export type BackupConfig = SecurityConfig['BACKUP']
export type MonitoringConfig = SecurityConfig['MONITORING']
export type ComplianceConfig = SecurityConfig['COMPLIANCE']
export type APIConfig = SecurityConfig['API']
export type DatabaseConfig = SecurityConfig['DATABASE']
export type NetworkConfig = SecurityConfig['NETWORK']
export type DevelopmentConfig = SecurityConfig['DEVELOPMENT']
