import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get URL parameters
export function getUrlParam(param: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(param);
}

/**
 * Encrypts data using AES-256-GCM encryption
 * @param data The data to encrypt
 * @returns The encrypted data as a base64 string
 */
export function encryptData(data: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('Encryption key not found in environment variables');
  }

  // Generate a random initialization vector
  const iv = crypto.randomBytes(12);
  
  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag();
  
  // Combine IV, encrypted data and auth tag
  const result = Buffer.concat([
    iv,
    Buffer.from(encrypted, 'base64'),
    authTag
  ]);
  
  return result.toString('base64');
}
