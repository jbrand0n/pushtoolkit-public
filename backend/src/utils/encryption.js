import crypto from 'crypto';

// Validate encryption key in production
if (process.env.NODE_ENV === 'production' && !process.env.ENCRYPTION_KEY) {
  throw new Error('FATAL: ENCRYPTION_KEY must be set in production environment for encrypting sensitive data.');
}

if (process.env.NODE_ENV === 'production' && process.env.ENCRYPTION_KEY?.length !== 32) {
  throw new Error('FATAL: ENCRYPTION_KEY must be exactly 32 characters long.');
}

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'dev-key-32-chars-change-this!';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt sensitive data (e.g., VAPID private keys)
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted text in format: iv:authTag:encryptedData
 */
export const encrypt = (text) => {
  if (!text) {
    throw new Error('Cannot encrypt empty text');
  }

  // Generate random IV for each encryption
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'utf8'),
    iv
  );

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  // Return format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Encrypted text in format: iv:authTag:encryptedData
 * @returns {string} Decrypted plain text
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) {
    throw new Error('Cannot decrypt empty text');
  }

  try {
    // Split the encrypted text
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }

    const [ivHex, authTagHex, encrypted] = parts;

    // Convert from hex
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'utf8'),
      iv
    );

    // Set auth tag
    decipher.setAuthTag(authTag);

    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

/**
 * Generate a secure random encryption key
 * @returns {string} 32-character random key
 */
export const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('base64').slice(0, 32);
};
