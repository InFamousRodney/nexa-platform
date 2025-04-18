import { encode, decode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

/**
 * Converts a hex string to a Uint8Array
 * @param hex The hex string to convert
 * @returns A Uint8Array containing the raw bytes
 * @throws Error if:
 *   - hex string length is not 64 characters
 *   - hex string contains invalid characters
 */
function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length !== 64) {
    throw new Error(`Invalid hex string length: expected 64 characters, got ${hex.length}`)
  }

  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error('Invalid hex string: contains non-hex characters')
  }

  return new Uint8Array(
    hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  )
}

/**
 * Imports a key for AES-GCM encryption/decryption
 * @param keyBytes The raw key bytes
 * @param usage The intended key usage ('encrypt' or 'decrypt')
 * @returns A CryptoKey for AES-GCM operations
 * @throws Error if key length is not 32 bytes
 */
async function importAesGcmKey(keyBytes: Uint8Array, usage: KeyUsage): Promise<CryptoKey> {
  if (keyBytes.length !== 32) {
    throw new Error(`Invalid key length: expected 32 bytes, got ${keyBytes.length} bytes`)
  }

  return await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    [usage]
  )
}

/**
 * Encrypts data using AES-GCM encryption
 * @param data The string data to encrypt
 * @returns The encrypted data as a base64 string
 * @throws Error if:
 *   - TOKEN_ENCRYPTION_KEY is not set
 *   - TOKEN_ENCRYPTION_KEY has invalid length or format
 */
export async function encryptData(data: string): Promise<string> {
  const key = Deno.env.get('TOKEN_ENCRYPTION_KEY')
  if (!key) {
    throw new Error('TOKEN_ENCRYPTION_KEY not found in environment variables')
  }

  // Convert hex key to bytes and validate
  const keyBytes = hexToUint8Array(key)

  // Import key for encryption
  const cryptoKey = await importAesGcmKey(keyBytes, 'encrypt')

  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encrypt the data
  const encodedData = new TextEncoder().encode(data)
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    cryptoKey,
    encodedData
  )

  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + new Uint8Array(encryptedData).length)
  result.set(iv)
  result.set(new Uint8Array(encryptedData), iv.length)

  // Convert to base64 using the standard library's encode function
  return encode(result.buffer)
}

/**
 * Decrypts data using AES-GCM decryption
 * @param encryptedData The encrypted data as a base64 string
 * @returns The decrypted string
 * @throws Error if:
 *   - TOKEN_ENCRYPTION_KEY is not set
 *   - TOKEN_ENCRYPTION_KEY has invalid length or format
 *   - Encrypted data is too short to contain IV
 *   - Decryption fails (invalid key or corrupted data)
 */
export async function decryptData(encryptedData: string): Promise<string> {
  const key = Deno.env.get('TOKEN_ENCRYPTION_KEY')
  if (!key) {
    throw new Error('TOKEN_ENCRYPTION_KEY not found in environment variables')
  }

  // Convert hex key to bytes and validate
  const keyBytes = hexToUint8Array(key)

  // Import key for decryption
  const cryptoKey = await importAesGcmKey(keyBytes, 'decrypt')

  // Decode the base64 data
  const combined = decode(encryptedData)

  // Check if data is long enough to contain IV
  if (combined.length < 12) {
    throw new Error('Invalid encrypted data: too short to contain IV')
  }

  // Extract IV and encrypted data
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)

  try {
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      data
    )

    // Return as string
    return new TextDecoder().decode(decryptedData)
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    throw new Error(`Decryption failed: ${errorMessage}. Check key or data integrity.`)
  }
} 