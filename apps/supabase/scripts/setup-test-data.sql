-- Clear existing test data
TRUNCATE TABLE salesforce_connections CASCADE;
TRUNCATE TABLE organization_members CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- Insert test organization
INSERT INTO organizations (id, name, owner_id)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Test Organization',
    '908202e6-6470-4650-9185-283868bb7521'
);

-- Link existing user to organization as admin
INSERT INTO organization_members (organization_id, user_id, role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '908202e6-6470-4650-9185-283868bb7521',
    'admin'
);

-- Insert test Salesforce connection
INSERT INTO salesforce_connections (
    id,
    organization_id,
    sf_org_id,
    instance_url,
    status
)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '00DTEST00001AbCdEAF',
    'https://test.salesforce.com',
    'active'
); 