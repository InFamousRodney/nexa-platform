-- ### Seed Data for Local Development ###

-- ======================================================================
-- 1. Insert a sample Organization
-- ======================================================================
-- We gebruiken een vaste UUID zodat we er later naar kunnen verwijzen.
-- Dit maakt het gemakkelijker om consistente testdata te hebben.
INSERT INTO public.organizations (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'Test Organization')
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
   '11111111-1111-1111-1111-111111111111', 
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
   '11111111-1111-1111-1111-111111111111', 
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