import { encode as base64Encode, decode as base64Decode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

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

  const base64Key = Deno.env.get('TOKEN_ENCRYPTION_KEY');
  if (!base64Key) {
    throw new Error('TOKEN_ENCRYPTION_KEY environment variable is not set');
  }

  try {
    // Convert base64 key to Uint8Array
    const keyData = base64Decode(base64Key);

    // Import the key
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: ALGORITHM },
      false, // not extractable
      ['encrypt', 'decrypt']
    );

    cachedCryptoKey = key;
    return key;
  } catch (error) {
    throw new Error(`Failed to import encryption key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Encrypts a string using AES-GCM
 * @param data - The string to encrypt
 * @returns Promise resolving to an EncryptedResult containing the Base64 encoded ciphertext and IV
 * @throws {Error} If encryption fails
 */
export async function encryptData(data: string): Promise<EncryptedResult> {
  try {
    const key = await getOrCreateCryptoKey();
    
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
    
    // Encrypt the data
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      encodedData
    );

    // Convert results to base64
    const ciphertext = base64Encode(new Uint8Array(encryptedData));
    const ivBase64 = base64Encode(iv);

    return {
      ciphertext,
      iv: ivBase64
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypts an encrypted result using AES-GCM
 * @param encryptedResult - The EncryptedResult containing the ciphertext and IV
 * @returns Promise resolving to the decrypted string
 * @throws {Error} If decryption fails (e.g., due to tampering or invalid key)
 */
export async function decryptData(encryptedResult: EncryptedResult): Promise<string> {
  try {
    const key = await getOrCreateCryptoKey();
    
    // Convert base64 strings back to Uint8Arrays
    const ciphertext = base64Decode(encryptedResult.ciphertext);
    const iv = base64Decode(encryptedResult.iv);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      ciphertext
    );

    // Convert the decrypted data back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    if (error instanceof DOMException) {
      throw new Error('Decryption failed: Data may have been tampered with or encryption key is invalid');
    }
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Tests the encryption and decryption functionality
 * @throws {Error} If the test fails
 */
export async function testEncryptionDecryption(): Promise<void> {
  const testData = 'Test string with special chars: !@#$%^&*()';
  
  // Test encryption
  const encrypted = await encryptData(testData);
  
  // Verify encrypted result format
  if (!encrypted.ciphertext || !encrypted.iv) {
    throw new Error('Encryption test failed: Missing required encrypted result properties');
  }
  
  // Test decryption
  const decrypted = await decryptData(encrypted);
  
  // Verify decrypted data matches original
  if (decrypted !== testData) {
    throw new Error('Encryption test failed: Decrypted data does not match original');
  }
} 