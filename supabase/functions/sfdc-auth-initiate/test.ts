import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { generateRandomString, generateCodeChallenge } from "./index.ts";

Deno.test("generateRandomString", async (t) => {
  await t.step("should create strings of correct length", () => {
    const length = 32;
    const result = generateRandomString(length);
    assertEquals(result.length, length);
  });

  await t.step("should only use allowed characters", () => {
    const result = generateRandomString(100);
    const allowedChars = /^[A-Za-z0-9\-._~]+$/;
    assertEquals(allowedChars.test(result), true);
  });

  await t.step("should produce different results each time", () => {
    const result1 = generateRandomString(32);
    const result2 = generateRandomString(32);
    assertEquals(result1 !== result2, true);
  });
});

Deno.test("generateCodeChallenge", async (t) => {
  await t.step("should produce valid base64url", async () => {
    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);
    
    // Check if it's valid base64url (no +, /, or = padding)
    const base64urlRegex = /^[A-Za-z0-9\-._]+$/;
    assertEquals(base64urlRegex.test(challenge), true);
  });

  await t.step("should produce consistent results", async () => {
    const verifier = "test-verifier-string";
    const challenge1 = await generateCodeChallenge(verifier);
    const challenge2 = await generateCodeChallenge(verifier);
    assertEquals(challenge1, challenge2);
  });

  await t.step("should produce different challenges for different verifiers", async () => {
    const verifier1 = generateRandomString(128);
    const verifier2 = generateRandomString(128);
    const challenge1 = await generateCodeChallenge(verifier1);
    const challenge2 = await generateCodeChallenge(verifier2);
    assertEquals(challenge1 !== challenge2, true);
  });
}); 