import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";
import { encryptData, decryptData, testEncryptionDecryption } from "./security.ts";

// Helper function to generate a valid base64 encoded AES key
function generateValidKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
  return base64Encode(key);
}

Deno.test({
  name: "Basic encryption and decryption works",
  async fn() {
    // Set a valid encryption key
    Deno.env.set("TOKEN_ENCRYPTION_KEY", generateValidKey());

    const testData = "Hello, World!";
    const encrypted = await encryptData(testData);
    const decrypted = await decryptData(encrypted);

    assertEquals(decrypted, testData, "Decrypted data should match original");
  },
});

Deno.test({
  name: "Handles special characters correctly",
  async fn() {
    Deno.env.set("TOKEN_ENCRYPTION_KEY", generateValidKey());

    const testData = "Special chars: !@#$%^&*()_+-=[]{}|;:'\",.<>?/~`";
    const encrypted = await encryptData(testData);
    const decrypted = await decryptData(encrypted);

    assertEquals(decrypted, testData, "Decrypted data should match original with special characters");
  },
});

Deno.test({
  name: "Handles Unicode characters correctly",
  async fn() {
    Deno.env.set("TOKEN_ENCRYPTION_KEY", generateValidKey());

    const testData = "Unicode: 🚀 你好 привет שָׁלוֹם";
    const encrypted = await encryptData(testData);
    const decrypted = await decryptData(encrypted);

    assertEquals(decrypted, testData, "Decrypted data should match original with Unicode characters");
  },
});

Deno.test({
  name: "Handles long strings correctly",
  async fn() {
    Deno.env.set("TOKEN_ENCRYPTION_KEY", generateValidKey());

    const testData = "a".repeat(10000); // 10KB string
    const encrypted = await encryptData(testData);
    const decrypted = await decryptData(encrypted);

    assertEquals(decrypted, testData, "Decrypted data should match original for long strings");
  },
});

// Error handling tests with cache-busting imports
Deno.test({
  name: "Fails when encryption key is not set",
  async fn() {
    Deno.env.delete("TOKEN_ENCRYPTION_KEY");

    // Use cache-busting import to ensure fresh key check
    const { encryptData: freshEncrypt } = await import("./security.ts?_=" + Math.random());

    await assertRejects(
      () => freshEncrypt("test"),
      Error,
      "TOKEN_ENCRYPTION_KEY environment variable is not set",
    );
  },
});

Deno.test({
  name: "Fails when encryption key is invalid base64",
  async fn() {
    Deno.env.set("TOKEN_ENCRYPTION_KEY", "invalid-base64!");

    // Use cache-busting import to ensure fresh key check
    const { encryptData: freshEncrypt } = await import("./security.ts?_=" + Math.random());

    await assertRejects(
      () => freshEncrypt("test"),
      Error,
      "Failed to import encryption key",
    );

    // Clean up the env var for subsequent tests
    Deno.env.delete("TOKEN_ENCRYPTION_KEY");
  },
});

Deno.test({
  name: "Decrypt fails when encryption key is not set",
  async fn() {
    // Ensure the key is NOT set for this test
    Deno.env.delete("TOKEN_ENCRYPTION_KEY");

    // Generate a dummy encrypted object with a valid base64 IV structure
    // to ensure the failure occurs during key retrieval, not IV decoding.
    const dummyIv = base64Encode(crypto.getRandomValues(new Uint8Array(12)));
    const dummyEncryptedValidIv = { ciphertext: base64Encode(new TextEncoder().encode("dummy")), iv: dummyIv };

    // Use cache-busting import to ensure fresh key check
    const { decryptData: freshDecrypt } = await import("./security.ts?_=" + Math.random());

    await assertRejects(
      () => freshDecrypt(dummyEncryptedValidIv), // Use the fresh import
      Error,
      "TOKEN_ENCRYPTION_KEY environment variable is not set",
    );
  },
});

Deno.test({
  name: "Decrypt fails when encryption key is invalid base64",
  async fn() {
    // Set an invalid key for this test
    Deno.env.set("TOKEN_ENCRYPTION_KEY", "invalid-base64!");

    // Generate a dummy encrypted object with a valid base64 IV structure
    const dummyIv = base64Encode(crypto.getRandomValues(new Uint8Array(12)));
    const dummyEncryptedValidIv = { ciphertext: base64Encode(new TextEncoder().encode("dummy")), iv: dummyIv };

    // Use cache-busting import to ensure fresh key check
    const { decryptData: freshDecrypt } = await import("./security.ts?_=" + Math.random());

    await assertRejects(
      () => freshDecrypt(dummyEncryptedValidIv), // Use the fresh import
      Error,
      "Failed to import encryption key", // Check error message contains this substring
    );

    // Clean up the env var for subsequent tests if running in sequence
    Deno.env.delete("TOKEN_ENCRYPTION_KEY");
  },
});

Deno.test({
  name: "Fails when decrypting with tampered IV",
  async fn() {
    Deno.env.set("TOKEN_ENCRYPTION_KEY", generateValidKey());

    const encrypted = await encryptData("test");
    const tamperedData = {
      ...encrypted,
      iv: base64Encode(crypto.getRandomValues(new Uint8Array(12))), // Different IV
    };

    await assertRejects(
      () => decryptData(tamperedData),
      Error,
      "Decryption failed: Data may have been tampered with or encryption key is invalid",
    );
  },
});

Deno.test({
  name: "Fails when decrypting with tampered ciphertext",
  async fn() {
    Deno.env.set("TOKEN_ENCRYPTION_KEY", generateValidKey());

    const encrypted = await encryptData("test");
    const tamperedData = {
      ...encrypted,
      ciphertext: encrypted.ciphertext.slice(0, -1) + "A", // Change last character
    };

    await assertRejects(
      () => decryptData(tamperedData),
      Error,
      "Decryption failed: Data may have been tampered with or encryption key is invalid",
    );
  },
});

Deno.test({
  name: "Built-in test function works correctly",
  async fn() {
    Deno.env.set("TOKEN_ENCRYPTION_KEY", generateValidKey());
    await testEncryptionDecryption();
  },
}); 