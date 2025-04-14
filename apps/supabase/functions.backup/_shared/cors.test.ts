import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { handleCors } from "./cors.ts";

Deno.test("CORS handling - allowed origin", () => {
  const request = new Request("http://example.com", {
    headers: {
      "Origin": "http://localhost:5173"
    }
  });

  const result = handleCors(request);
  const headers = new Headers(result instanceof Response ? result.headers : result.headers);

  assertEquals(headers.get("Access-Control-Allow-Origin"), "http://localhost:5173");
  assertEquals(headers.get("Access-Control-Allow-Methods"), "GET, POST, PUT, DELETE, OPTIONS");
  assertEquals(headers.get("Access-Control-Allow-Headers"), "Authorization, Content-Type");
});

Deno.test("CORS handling - disallowed origin", () => {
  const request = new Request("http://example.com", {
    headers: {
      "Origin": "http://malicious-site.com"
    }
  });

  const result = handleCors(request);
  const headers = new Headers(result instanceof Response ? result.headers : result.headers);

  assertEquals(headers.get("Access-Control-Allow-Origin"), "http://localhost:5173");
});

Deno.test("CORS handling - preflight request", () => {
  const request = new Request("http://example.com", {
    method: "OPTIONS",
    headers: {
      "Origin": "http://localhost:5173"
    }
  });

  const result = handleCors(request);
  
  if (result instanceof Response) {
    assertEquals(result.status, 204);
    assertEquals(result.headers.get("Access-Control-Allow-Origin"), "http://localhost:5173");
    assertEquals(result.headers.get("Access-Control-Allow-Methods"), "GET, POST, PUT, DELETE, OPTIONS");
    assertEquals(result.headers.get("Access-Control-Allow-Headers"), "Authorization, Content-Type");
  } else {
    throw new Error("Expected Response for OPTIONS request");
  }
}); 