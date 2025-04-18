import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { encryptData } from '../utils';

describe('encryptData', () => {
  const originalEnv = process.env;
  const testKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.ENCRYPTION_KEY = testKey;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should encrypt data using AES-256-GCM', () => {
    const data = 'test data';
    const encrypted = encryptData(data);
    
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(data);
    expect(encrypted).toMatch(/^[A-Za-z0-9+/]+={0,2}$/); // Base64 format
  });

  it('should throw an error if encryption key is not set', () => {
    delete process.env.ENCRYPTION_KEY;
    expect(() => encryptData('test data')).toThrow('Encryption key not found in environment variables');
  });

  it('should produce different encrypted outputs for the same input', () => {
    const data = 'test data';
    const encrypted1 = encryptData(data);
    const encrypted2 = encryptData(data);
    
    expect(encrypted1).not.toBe(encrypted2); // Different IVs should produce different outputs
  });

  it('should handle different types of data', () => {
    const testCases = [
      'simple string',
      JSON.stringify({ complex: 'object', with: ['nested', 'data'] }),
      'special characters: !@#$%^&*()',
      'unicode: 😊🎉🌟',
      'very long string '.repeat(1000)
    ];

    testCases.forEach(data => {
      const encrypted = encryptData(data);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(data);
      expect(encrypted).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    });
  });

  it('should handle empty string', () => {
    const encrypted = encryptData('');
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe('');
    expect(encrypted).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
  });
}); 