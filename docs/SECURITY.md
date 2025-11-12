# Security Guide

## Overview

This document outlines security measures implemented in the Push Notification Platform and recommendations for production deployment.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [CSRF Protection](#csrf-protection)
3. [Input Validation](#input-validation)
4. [Data Encryption](#data-encryption)
5. [Rate Limiting](#rate-limiting)
6. [Security Headers](#security-headers)
7. [Secure Session Management](#secure-session-management)
8. [Production Checklist](#production-checklist)

---

## Authentication & Authorization

### JWT-Based Authentication

The platform uses JSON Web Tokens (JWT) for stateless authentication.

**Configuration:**
```bash
# .env
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Security Requirements:**
- ✅ JWT_SECRET must be set in production (enforced in code)
- ✅ JWT_SECRET must not be default value in production
- ✅ Minimum 32 characters recommended
- ✅ Tokens expire after 7 days (configurable)

**Best Practices:**
1. Store tokens in httpOnly cookies (not localStorage) for web apps
2. Use secure flag for cookies in production (HTTPS only)
3. Implement token refresh mechanism
4. Blacklist tokens on logout (if needed)

### Password Security

**Current Implementation:**
- ✅ Bcrypt hashing with 10 salt rounds
- ✅ Strong password requirements enforced:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

**Recommendations:**
- Consider increasing to 12+ salt rounds for higher security
- Implement password history to prevent reuse
- Add password strength meter in UI
- Implement account lockout after failed attempts

---

## CSRF Protection

### Current Status

The platform currently uses **JWT in Authorization headers**, which provides some CSRF protection since:
- Attackers cannot access Authorization headers via CSRF
- Tokens are validated on every request

### Enhanced CSRF Protection Options

#### Option 1: SameSite Cookies (Recommended for Cookie-Based Auth)

If you switch to cookie-based auth, use SameSite attribute:

```javascript
// In Express
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict', // or 'lax'
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

**SameSite Values:**
- `strict`: Maximum protection, blocks all cross-site requests
- `lax`: Allows top-level navigation (e.g., links from external sites)
- `none`: No protection (requires `secure` flag)

#### Option 2: Double Submit Cookie Pattern

Implement CSRF token alongside JWT:

```javascript
// Backend: Generate CSRF token
import csrf from 'csurf';

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Apply to state-changing routes
app.post('/api/sites', csrfProtection, createSite);
```

```javascript
// Frontend: Include CSRF token
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
```

#### Option 3: Custom Headers (Current Approach)

Using custom headers like `Authorization: Bearer <token>` provides CSRF protection because:
- JavaScript can set custom headers
- CSRF attacks cannot set custom headers (browser restriction)
- This is the current implementation ✅

### Implementation

To add explicit CSRF protection:

```bash
npm install csurf cookie-parser
```

```javascript
// backend/src/index.js
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });

// Get CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Apply to state-changing routes
app.post('/api/*', csrfProtection);
app.patch('/api/*', csrfProtection);
app.delete('/api/*', csrfProtection);
```

```javascript
// frontend/src/lib/api.js
// Fetch CSRF token on app load
const fetchCsrfToken = async () => {
  const response = await axios.get('/api/csrf-token');
  axios.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
};

// Call on app initialization
fetchCsrfToken();
```

**Note:** Since the platform uses JWT in Authorization headers (not cookies), CSRF protection is already in place. Explicit CSRF tokens are optional but recommended for defense in depth.

---

## Input Validation

### Express Validator

All API endpoints use express-validator for input sanitization and validation.

**Example:**
```javascript
import { body, validationResult } from 'express-validator';

export const validateCreateSite = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 }),
  body('url')
    .trim()
    .isURL(),
  handleValidationErrors
];
```

**Validation Coverage:**
- ✅ Authentication endpoints (email, password)
- ✅ Site management (name, URL)
- ✅ Notification creation (title, message, URLs)
- ✅ Subscriber management
- ✅ Query parameters (pagination, filters)

### SQL Injection Protection

- ✅ Using Prisma ORM (parameterized queries)
- ✅ No raw SQL queries
- ✅ Input validation on all endpoints

### XSS Protection

- ✅ Helmet.js security headers
- ✅ Content-Security-Policy configured
- ✅ Input sanitization
- ✅ React escapes output by default

---

## Data Encryption

### Encryption at Rest

**VAPID Private Keys:**
- ✅ Encrypted using AES-256-GCM
- ✅ Unique IV for each encryption
- ✅ Authentication tags for integrity

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('base64').slice(0, 32))"

# .env
ENCRYPTION_KEY=your-32-character-encryption-key
```

**Password Storage:**
- ✅ Bcrypt hashing (one-way)
- ✅ 10 salt rounds
- ✅ Never stored in plain text

### Encryption in Transit

- ✅ HTTPS/TLS required for production
- ✅ TLS 1.2+ only
- ✅ Strong cipher suites

---

## Rate Limiting

### Global Rate Limiting

```javascript
// 100 requests per 15 minutes per IP
app.use('/api/', rateLimiter);
```

### Auth Endpoint Rate Limiting

```javascript
// 5 requests per 15 minutes for auth endpoints
router.post('/login', authLimiter, login);
router.post('/register', authLimiter, register);
```

### Recommendations

For production, consider:
- Redis-based rate limiting (distributed)
- Different limits per endpoint
- Account-based rate limiting
- Gradually increasing penalties

---

## Security Headers

### Helmet.js Configuration

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

### Headers Provided

- ✅ Strict-Transport-Security (HSTS)
- ✅ X-Frame-Options (clickjacking protection)
- ✅ X-Content-Type-Options (MIME sniffing protection)
- ✅ X-XSS-Protection
- ✅ Content-Security-Policy

---

## Secure Session Management

### Current Implementation

- JWT in Authorization header
- Stateless authentication
- No server-side session storage

### Improvements for Production

1. **Token Refresh**
```javascript
// Implement refresh token flow
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  // Verify refresh token
  // Issue new access token
});
```

2. **Token Blacklisting**
```javascript
// On logout, add token to blacklist
await redis.set(`blacklist:${token}`, '1', 'EX', tokenExpiry);
```

3. **Device Tracking**
```javascript
// Track active sessions per user
await redis.sadd(`sessions:${userId}`, sessionId);
```

---

## Production Checklist

### Environment Variables
- [ ] JWT_SECRET set to strong random value
- [ ] ENCRYPTION_KEY set to 32-character value
- [ ] DATABASE_URL uses strong password
- [ ] REDIS_PASSWORD set (if applicable)
- [ ] NODE_ENV=production

### HTTPS/TLS
- [ ] SSL certificate installed
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header enabled
- [ ] TLS 1.2+ only
- [ ] Strong cipher suites

### Authentication
- [ ] JWT secrets rotated regularly
- [ ] Strong password policy enforced
- [ ] Account lockout implemented
- [ ] 2FA considered for admin accounts

### Database
- [ ] Connection uses SSL
- [ ] Credentials use strong passwords
- [ ] Database user has minimum privileges
- [ ] Regular backups enabled
- [ ] Backup encryption enabled

### Monitoring
- [ ] Error logging configured
- [ ] Security event logging
- [ ] Failed login attempts tracked
- [ ] Unusual activity alerts
- [ ] Log retention policy

### Updates
- [ ] Dependencies updated regularly
- [ ] Security patches applied promptly
- [ ] Automated vulnerability scanning
- [ ] Change management process

### Network
- [ ] Firewall configured
- [ ] Only necessary ports exposed
- [ ] DDoS protection enabled
- [ ] WAF considered (Cloudflare, etc.)

---

## Security Incident Response

### If Breach Suspected

1. **Immediate Actions**
   - Isolate affected systems
   - Preserve evidence (logs, etc.)
   - Change all credentials
   - Notify stakeholders

2. **Investigation**
   - Review access logs
   - Identify breach vector
   - Assess data exposure
   - Document findings

3. **Remediation**
   - Patch vulnerabilities
   - Implement additional controls
   - Test fixes
   - Deploy updates

4. **Post-Incident**
   - Review and improve security
   - Update procedures
   - Train team
   - Consider external audit

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## Reporting Security Issues

If you discover a security vulnerability, please email security@your-domain.com. Do not create public GitHub issues for security vulnerabilities.

**We commit to:**
- Acknowledge receipt within 24 hours
- Provide status updates every 48 hours
- Fix critical issues within 7 days
- Credit security researchers (if desired)
