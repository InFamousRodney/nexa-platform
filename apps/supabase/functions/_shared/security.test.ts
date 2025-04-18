import { assertEquals, assertRejects, assertNotEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { encryptData, decryptData } from './security.ts';
import { decode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

// --- Test Constants ---
const TEST_KEY_HEX = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const WRONG_KEY_HEX = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
const INVALID_KEY_SHORT = '012345';
const INVALID_KEY_NOT_HEX = 'g'.repeat(64); // 64 non-hex characters

// --- encryptData Tests ---
Deno.test('encryptData - should encrypt data using AES-GCM', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  const data = 'test data';
  const encrypted = await encryptData(data);
  assertNotEquals(encrypted, data);
  assertEquals(typeof encrypted, 'string');
  assertEquals(/^[A-Za-z0-9+/]+={0,2}$/.test(encrypted), true);
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('encryptData - should produce different outputs for the same input', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  const data = 'test data';
  const encrypted1 = await encryptData(data);
  const encrypted2 = await encryptData(data);
  assertNotEquals(encrypted1, encrypted2);
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('encryptData - should throw error for short key', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', INVALID_KEY_SHORT);
  await assertRejects(
    () => encryptData('test data'),
    Error,
    `Invalid hex string length: expected 64 characters, got ${INVALID_KEY_SHORT.length}`
  );
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('encryptData - should throw error for non-hex key', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', INVALID_KEY_NOT_HEX);
  await assertRejects(
    () => encryptData('test data'),
    Error,
    'Invalid hex string: contains non-hex characters'
  );
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

// --- decryptData and Round Trip Tests ---
Deno.test('decryptData - should successfully decrypt data encrypted by encryptData (round trip)', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  const data = 'test data';
  const encrypted = await encryptData(data);
  const decrypted = await decryptData(encrypted);
  assertEquals(decrypted, data);
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('decryptData - should successfully decrypt empty string (round trip)', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  const data = '';
  const encrypted = await encryptData(data);
  const decrypted = await decryptData(encrypted);
  assertEquals(decrypted, data);
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

// --- decryptData Failure Tests ---
Deno.test('decryptData - should throw error if TOKEN_ENCRYPTION_KEY is not set', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  const encrypted = await encryptData('test data');
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
  await assertRejects(
    () => decryptData(encrypted),
    Error,
    'TOKEN_ENCRYPTION_KEY not found in environment variables'
  );
});

Deno.test('decryptData - should throw decryption failed error with wrong key', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  const encrypted = await encryptData('test data');
  Deno.env.set('TOKEN_ENCRYPTION_KEY', WRONG_KEY_HEX);
  await assertRejects(
    () => decryptData(encrypted),
    Error,
    /Decryption failed:/
  );
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('decryptData - should throw decryption failed error for tampered data', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  const encrypted = await encryptData('test data');
  // Tamper with the encrypted data by changing one character
  const tampered = encrypted.slice(0, -1) + (encrypted.slice(-1) === 'A' ? 'B' : 'A');
  await assertRejects(
    () => decryptData(tampered),
    Error,
    /Decryption failed:/
  );
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('decryptData - should throw error if input is too short to contain IV', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', TEST_KEY_HEX);
  // Create a base64 string that decodes to less than 12 bytes
  const tooShort = encode(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
  await assertRejects(
    () => decryptData(tooShort),
    Error,
    'Invalid encrypted data: too short to contain IV'
  );
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('decryptData - should throw error for short key', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', INVALID_KEY_SHORT);
  // Use a valid encrypted string (from TEST_KEY_HEX) to trigger key validation
  Deno.env.set('TOKEN_ENCRYPTION_KEY', INVALID_KEY_SHORT);
  await assertRejects(
    () => decryptData('dGVzdCBkYXRh'),
    Error,
    `Invalid hex string length: expected 64 characters, got ${INVALID_KEY_SHORT.length}`
  );
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
});

Deno.test('decryptData - should throw error for non-hex key', async () => {
  Deno.env.set('TOKEN_ENCRYPTION_KEY', INVALID_KEY_NOT_HEX);
  await assertRejects(
    () => decryptData('dGVzdCBkYXRh'),
    Error,
    'Invalid hex string: contains non-hex characters'
  );
  Deno.env.delete('TOKEN_ENCRYPTION_KEY');
}); 