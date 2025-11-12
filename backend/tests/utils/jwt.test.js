import { describe, expect, test, beforeEach } from '@jest/globals';
import { generateToken, verifyToken, extractToken } from '../../src/utils/jwt.js';

describe('JWT Utils', () => {
  describe('generateToken', () => {
    test('should generate a valid JWT token', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'OWNER' };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should include payload data in token', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'OWNER' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe('verifyToken', () => {
    test('should verify and decode a valid token', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'OWNER' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe('123');
      expect(decoded.email).toBe('test@example.com');
    });

    test('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.here');
      }).toThrow();
    });

    test('should throw error for malformed token', () => {
      expect(() => {
        verifyToken('not-even-a-jwt');
      }).toThrow();
    });
  });

  describe('extractToken', () => {
    test('should extract token from Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const authHeader = `Bearer ${token}`;
      const extracted = extractToken(authHeader);

      expect(extracted).toBe(token);
    });

    test('should return null for missing header', () => {
      const extracted = extractToken(null);
      expect(extracted).toBeNull();
    });

    test('should return null for invalid format', () => {
      const extracted = extractToken('InvalidFormat token');
      expect(extracted).toBeNull();
    });

    test('should return null for missing Bearer prefix', () => {
      const extracted = extractToken('token123');
      expect(extracted).toBeNull();
    });
  });
});
