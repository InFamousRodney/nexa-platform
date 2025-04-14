-- ### Seed Data for Local Development ###

-- ======================================================================
-- 1. Insert a sample Organization
-- ======================================================================
-- We gebruiken een vaste UUID zodat we er later naar kunnen verwijzen.
-- Dit maakt het gemakkelijker om consistente testdata te hebben.
INSERT INTO public.organizations (id, name, description, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'Test Organization', 'Test organization for development', '2024-03-20T00:00:00Z', '2024-03-20T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ======================================================================
-- 2. Koppel de handmatig aangemaakte testgebruiker aan de organisatie
-- ======================================================================
-- BELANGRIJK: Verwijst naar de reeds bestaande gebruiker in het systeem
-- UUID: 97d681aa-0e72-47e8-b059-8998d8b19994
-- We gebruiken de directe UUID om foreign key constraint errors te voorkomen.
-- OPMERKING: Dit deel is uitgecommentarieerd omdat de gebruiker nog niet bestaat in auth.users
-- Je kunt dit deel handmatig uitvoeren nadat je een gebruiker hebt aangemaakt in Supabase Auth UI.
/*
INSERT INTO public.organization_members (organization_id, user_id, role)
VALUES (
  '11111111-1111-1111-1111-111111111111', -- Test Org ID (vast)
  '97d681aa-0e72-47e8-b059-8998d8b19994', -- UUID van testgebruiker
  'admin' -- Administratorrol
)
ON CONFLICT (organization_id, user_id) DO NOTHING;
*/

-- ======================================================================
-- 3. Voeg Salesforce connecties toe voor de testorganisatie
-- ======================================================================
-- We gebruiken vaste UUIDs voor de connecties om ze consistent te houden
-- en om gemakkelijk naar te kunnen verwijzen in tests.
INSERT INTO public.salesforce_connections (id, organization_id, sf_org_id, instance_url, status)
VALUES
  ('33333333-3333-3333-3333-333333333333', 
   '00000000-0000-0000-0000-000000000001', 
   '00DTEST00001AbCdEAF', 
   'https://test-org-1.sandbox.my.salesforce.com', 
   'active')
ON CONFLICT (id) DO UPDATE SET 
  organization_id = EXCLUDED.organization_id,
  sf_org_id = EXCLUDED.sf_org_id,
  instance_url = EXCLUDED.instance_url,
  status = EXCLUDED.status;

INSERT INTO public.salesforce_connections (id, organization_id, sf_org_id, instance_url, status)
VALUES
  ('44444444-4444-4444-4444-444444444444', 
   '00000000-0000-0000-0000-000000000001', 
   '00DPROD00002BcDeFAT', 
   'https://production.my.salesforce.com', 
   'needs_reauth')
ON CONFLICT (id) DO UPDATE SET 
  organization_id = EXCLUDED.organization_id,
  sf_org_id = EXCLUDED.sf_org_id,
  instance_url = EXCLUDED.instance_url,
  status = EXCLUDED.status;

-- ======================================================================
-- Hier kunnen in de toekomst meer seed data worden toegevoegd
-- ======================================================================

-- Insert test organization member (assuming auth.uid() will be '00000000-0000-0000-0000-000000000001')
INSERT INTO public.organization_members (user_id, organization_id)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001'
);

-- Insert test Salesforce connection
INSERT INTO public.salesforce_connections (
    id,
    user_id,
    organization_id,
    name,
    instance_url
)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Test Salesforce Connection',
    'https://test.salesforce.com'
);

-- Insert sample organization
INSERT INTO organizations (id, name, description, created_at, updated_at)
VALUES (
    'c0d8d8d0-7e1a-4d1a-9e1a-8e1a9e1a8e1a',
    'Sample Organization',
    'A sample organization for testing',
    '2024-03-20T00:00:00Z',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample user
INSERT INTO users (id, email, name, created_at, updated_at)
VALUES (
    'd1e9e9e1-8f2b-5e2b-af2b-9f2baf2b9f2b',
    'test@example.com',
    'Test User',
    '2024-03-20T00:00:00Z',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert organization member
INSERT INTO organization_members (organization_id, user_id, role, created_at)
VALUES (
    'c0d8d8d0-7e1a-4d1a-9e1a-8e1a9e1a8e1a',
    'd1e9e9e1-8f2b-5e2b-af2b-9f2baf2b9f2b',
    'admin',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (organization_id, user_id) DO NOTHING;

-- Insert sample Salesforce connection
INSERT INTO salesforce_connections (
    id, organization_id, sf_org_id, friendly_name, instance_url,
    access_token, refresh_token, status, created_at, updated_at
)
VALUES (
    'e2fafaf2-9f3c-6f3c-bf3c-af3cbf3caf3c',
    'c0d8d8d0-7e1a-4d1a-9e1a-8e1a9e1a8e1a',
    '00D1a000000XXXXX',
    'Development Org',
    'https://test.salesforce.com',
    'sample_access_token',
    'sample_refresh_token',
    'active',
    '2024-03-20T00:00:00Z',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample metadata snapshot
INSERT INTO metadata_snapshots (
    id, connection_id, status, created_at, completed_at
)
VALUES (
    'f3fbfbf3-af4d-7f4d-cf4d-bf4dcf4dbf4d',
    'e2fafaf2-9f3c-6f3c-bf3c-af3cbf3caf3c',
    'completed',
    '2024-03-20T00:00:00Z',
    '2024-03-20T00:01:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample parsed component
INSERT INTO parsed_components (
    id, snapshot_id, api_name, component_type, metadata, created_at
)
VALUES (
    'g4fcfcf4-bf5e-8f5e-df5e-cf5edf5ecf5e',
    'f3fbfbf3-af4d-7f4d-cf4d-bf4dcf4dbf4d',
    'Account',
    'CustomObject',
    '{"label": "Account", "fields": ["Name", "Industry"]}',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample parsed relationship
INSERT INTO parsed_relationships (
    id, snapshot_id, source_component_api_name, source_component_type,
    target_component_api_name, target_component_type, relationship_type,
    context, created_at
)
VALUES (
    'h5fdfdh5-cf6f-9f6f-ef6f-df6fef6fdf6f',
    'f3fbfbf3-af4d-7f4d-cf4d-bf4dcf4dbf4d',
    'Contact',
    'CustomObject',
    'Account',
    'CustomObject',
    'BELONGS_TO',
    '{"fieldName": "AccountId", "isMasterDetail": false}',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample analysis result
INSERT INTO analysis_results (
    id, snapshot_id, analysis_type, component_api_name, component_type,
    severity, description, details, created_at
)
VALUES (
    'i6fefei6-df7g-af7g-ff7g-ef7gff7gef7g',
    'f3fbfbf3-af4d-7f4d-cf4d-bf4dcf4dbf4d',
    'FIELD_ANALYSIS',
    'Account',
    'CustomObject',
    'Warning',
    'Large number of fields detected',
    '{"fieldCount": 100, "recommendation": "Consider field cleanup"}',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample AI interaction
INSERT INTO ai_interactions (
    id, snapshot_id, user_id, prompt, neo4j_query_summary,
    llm_response, feedback_rating, feedback_comment, created_at
)
VALUES (
    'j7fffff7-ef8h-bf8h-gf8h-ff8hgf8hff8h',
    'f3fbfbf3-af4d-7f4d-cf4d-bf4dcf4dbf4d',
    'd1e9e9e1-8f2b-5e2b-af2b-9f2baf2b9f2b',
    'Analyze Account object relationships',
    'MATCH (a:Object {name: "Account"})-[r]->(b) RETURN a, r, b',
    'The Account object has relationships with Contact and Opportunity objects',
    5,
    'Very helpful analysis',
    '2024-03-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Clear existing data (if any)
TRUNCATE TABLE salesforce_connections CASCADE;
TRUNCATE TABLE organization_members CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- Insert test organization
INSERT INTO organizations (id, name, description, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Test Organization',
    'Test organization for development',
    NOW(),
    NOW()
);

-- Insert test user
INSERT INTO users (id, email, name, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'test@example.com',
    'Test User',
    NOW(),
    NOW()
);

-- Insert organization member
INSERT INTO organization_members (organization_id, user_id, role, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'admin',
    NOW()
);

-- Insert test Salesforce connection
INSERT INTO salesforce_connections (
    id,
    organization_id,
    sf_org_id,
    friendly_name,
    instance_url,
    access_token,
    refresh_token,
    status,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '00DTEST00001AbCdEAF',
    'Development Org',
    'https://test-org-1.sandbox.my.salesforce.com',
    'test_access_token',
    'test_refresh_token',
    'active',
    NOW(),
    NOW()
);