import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

console.log("Function is loading...");

serve(async (req) => {
  console.log("Request received:", req.url);
  
  return new Response(
    JSON.stringify({ 
      message: 'Test connection endpoint is working',
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { 
        'Content-Type': 'application/json'
      }
    }
  );
}); 