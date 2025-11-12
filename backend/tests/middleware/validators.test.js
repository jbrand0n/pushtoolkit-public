import { describe, expect, test, jest } from '@jest/globals';
import { handleValidationErrors } from '../../src/middleware/validators.js';
import { validationResult } from 'express-validator';

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
  body: jest.fn(() => ({
    isEmail: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    matches: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    trim: jest.fn().mockReturnThis(),
    normalizeEmail: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    isURL: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis(),
    isISO8601: jest.fn().mockReturnThis(),
    isUUID: jest.fn().mockReturnThis(),
    isObject: jest.fn().mockReturnThis(),
  })),
}));

describe('Validation Middleware', () => {
  describe('handleValidationErrors', () => {
    test('should call next() if no validation errors', () => {
      const req = {};
      const res = {};
      const next = jest.fn();

      // Mock no errors
      validationResult.mockReturnValueOnce({
        isEmpty: () => true,
        array: () => [],
      });

      handleValidationErrors(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should call next() with error if validation fails', () => {
      const req = {};
      const res = {};
      const next = jest.fn();

      // Mock validation errors
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [
          { msg: 'Email is invalid' },
          { msg: 'Password is too short' },
        ],
      });

      handleValidationErrors(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Email is invalid, Password is too short',
        statusCode: 400,
      }));
    });

    test('should combine multiple error messages', () => {
      const req = {};
      const res = {};
      const next = jest.fn();

      // Mock multiple validation errors
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [
          { msg: 'Error 1' },
          { msg: 'Error 2' },
          { msg: 'Error 3' },
        ],
      });

      handleValidationErrors(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error 1, Error 2, Error 3',
      }));
    });
  });
});
