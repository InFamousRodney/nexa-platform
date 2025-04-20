import { encode as base64Encode, decode as base64Decode } from "std/encoding/base64.ts";

const ALGORITHM = 'AES-GCM';
const IV_LENGTH_BYTES = 12;

/**
 * Interface representing the result of encryption
 */
export interface EncryptedResult {
  /** Base64 encoded ciphertext */
  ciphertext: string;
  /** Base64 encoded initialization vector */
  iv: string;
}

// Module-scoped variable to cache the imported CryptoKey
let cachedCryptoKey: CryptoKey | null = null;

/**
 * Gets the encryption key from environment and imports it as a CryptoKey
 * @throws {Error} If TOKEN_ENCRYPTION_KEY is not set or invalid
 */
async function getOrCreateCryptoKey(): Promise<CryptoKey> {
  if (cachedCryptoKey) {
    return cachedCryptoKey;
  }

  const key = Deno.env.get('TOKEN_ENCRYPTION_KEY');
  if (!key) {
    throw new Error('TOKEN_ENCRYPTION_KEY environment variable is not set');
  }

  // Convert base64 key to bytes
  const keyBytes = base64Decode(key);

  // Import the key
  cachedCryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt']
  );

  return cachedCryptoKey;
}

/**
 * Encrypts a string using AES-GCM
 * @param data - The string to encrypt
 * @returns Promise resolving to a base64 encoded string containing both IV and ciphertext
 * @throws {Error} If encryption fails
 */
export async function encryptData(data: string): Promise<string> {
  const key = await getOrCreateCryptoKey();
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
  
  // Encrypt
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    dataBytes
  );

  // Encode both IV and ciphertext to base64
  const ivBase64 = base64Encode(iv);
  const ciphertextBase64 = base64Encode(new Uint8Array(ciphertext));

  // Combine IV and ciphertext with a delimiter
  return `${ivBase64}.${ciphertextBase64}`;
}

/**
 * Decrypts an encrypted string using AES-GCM
 * @param encryptedData - The base64 encoded string containing IV and ciphertext
 * @returns Promise resolving to the decrypted string
 * @throws {Error} If decryption fails (e.g., due to tampering or invalid key)
 */
export async function decryptData(encryptedData: string): Promise<string> {
  const key = await getOrCreateCryptoKey();

  // Split IV and ciphertext
  const [ivBase64, ciphertextBase64] = encryptedData.split('.');
  if (!ivBase64 || !ciphertextBase64) {
    throw new Error('Invalid encrypted data format');
  }

  // Decode base64
  const iv = base64Decode(ivBase64);
  const ciphertext = base64Decode(ciphertextBase64);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    ciphertext
  );

  // Convert bytes to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Tests the encryption and decryption functionality
 * @throws {Error} If the test fails
 */
export async function testEncryptionDecryption(): Promise<void> {
  const testData = 'Test data to encrypt';
  
  // Encrypt
  const encrypted = await encryptData(testData);
  
  // Decrypt
  const decrypted = await decryptData(encrypted);
  
  // Verify
  if (decrypted !== testData) {
    throw new Error('Encryption/decryption test failed: data mismatch');
  }
}