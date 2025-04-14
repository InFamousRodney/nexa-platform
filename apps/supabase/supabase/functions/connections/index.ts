import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SalesforceConnectionResponse } from '../_shared/api.types.ts';

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: { ...corsHeaders, 'Allow': 'GET' }
      });
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with anon key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: authHeader }
        },
        db: {
          schema: 'public'
        }
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Unauthorized');
    }

    console.log('Authenticated user ID:', user.id);

    // Get user's organization membership with explicit schema
    const { data: orgMember, error: orgError } = await supabaseClient
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (orgError) {
      console.error('Org member error:', orgError);
      console.log('Query params:', { user_id: user.id });
      throw new Error(`Failed to get organization: ${orgError.message}`);
    }

    if (!orgMember) {
      throw new Error('No organization found for user');
    }

    console.log('Found organization:', orgMember.organization_id);

    // Get Salesforce connections for the organization
    const { data: connections, error: connectionsError } = await supabaseClient
      .from('salesforce_connections')
      .select('*')
      .eq('organization_id', orgMember.organization_id);

    if (connectionsError) {
      console.error('Connections error:', connectionsError);
      throw connectionsError;
    }

    // Map to response type
    const response: SalesforceConnectionResponse[] = connections.map(conn => ({
      id: conn.id,
      sf_org_id: conn.sf_org_id,
      instance_url: conn.instance_url,
      status: conn.status
    }));

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error:', error.message);
    const status = error.message === 'Unauthorized' ? 401 : 500;
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}); 