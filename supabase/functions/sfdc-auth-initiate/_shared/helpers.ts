import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

/**
 * Generates a random string of specified length using crypto-safe random values
 * @param length - The length of the string to generate
 * @returns A random string
 */
export function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
} 