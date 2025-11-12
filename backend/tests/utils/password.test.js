import { describe, expect, test } from '@jest/globals';
import { hashPassword, comparePassword } from '../../src/utils/password.js';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    test('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    test('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Due to salt, hashes should be different
      expect(hash1).not.toBe(hash2);
    });

    test('should generate bcrypt hash format', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      // Bcrypt hashes start with $2b$ or $2a$
      expect(hash).toMatch(/^\$2[aby]\$/);
    });
  });

  describe('comparePassword', () => {
    test('should return true for correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    test('should return false for incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });

    test('should be case sensitive', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword('testpassword123!', hash);

      expect(isMatch).toBe(false);
    });

    test('should work with special characters', async () => {
      const password = 'P@ssw0rd!#$%';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });
  });
});
